const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");

// REGISTER
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check duplicate
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash password — never store plain text
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    // Create profile based on role
    if (role === "STUDENT") {
      const { studentCode, department, level } = req.body;

      if (!studentCode || !department || !level) {
        return res.status(400).json({
          error: "studentCode, department and level are required for students",
        });
      }

      await prisma.student.create({
        data: {
          studentCode,
          department,
          level: Number(level),
          userId: user.id,
        },
      });
    }

    if (role === "LECTURER") {
      const { staffCode, department } = req.body;

      if (!staffCode || !department) {
        return res.status(400).json({
          error: "staffCode and department are required for lecturers",
        });
      }

      await prisma.lecturer.create({
        data: { staffCode, department, userId: user.id },
      });
    }

    // Never return password
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "Registration successful",
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
