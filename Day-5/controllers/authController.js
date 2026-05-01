const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ─── REGISTER ────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "name, email, password and role are required",
      });
    }

    // Check if email already exists
    // findUnique returns null if not found — no need for try/catch here
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash the password before storing
    // bcrypt.hash takes the plain password and a "salt rounds" number
    // 10 salt rounds is the standard — higher is more secure but slower
    // Never store plain text passwords — ever
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the User record
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    // Create role-specific profile
    if (role === "STUDENT") {
      const { studentCode, department, level } = req.body;

      if (!studentCode || !department || !level) {
        // If student profile data is missing, delete the user we just created
        // and return an error — we don't want orphaned users
        await prisma.user.delete({ where: { id: user.id } });
        return res.status(400).json({
          error: "studentCode, department and level are required for students",
        });
      }

      await prisma.student.create({
        data: {
          studentCode,
          department,
          level: Number(level),
          userId: user.id, // link this student to the user we just created
        },
      });
    }

    if (role === "LECTURER") {
      const { staffCode, department } = req.body;

      if (!staffCode || !department) {
        await prisma.user.delete({ where: { id: user.id } });
        return res.status(400).json({
          error: "staffCode and department are required for lecturers",
        });
      }

      await prisma.lecturer.create({
        data: {
          staffCode,
          department,
          userId: user.id,
        },
      });
    }

    // Destructure the password out of the response
    // The spread operator copies all other fields except password
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "Registration successful",
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

// ─── LOGIN ───────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Use a vague message — don't tell attackers whether email exists
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the submitted password against the stored hash
    // bcrypt.compare returns true if they match, false if not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create the JWT token
    // jwt.sign() takes three arguments:
    // 1. The payload — data to store inside the token
    // 2. The secret key — used to sign the token
    // 3. Options — like when the token expires
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    // req.user.id comes from the JWT token payload
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // include profile based on role
        student: true,
        lecturer: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
