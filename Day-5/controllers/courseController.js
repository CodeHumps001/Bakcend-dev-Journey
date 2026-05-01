const prisma = require("../prisma/client");

// ─── CREATE COURSE ───────────────────────────────────
const createCourse = async (req, res, next) => {
  try {
    const { code, name, department, semester, lecturerId } = req.body;

    if (!code || !name || !department || !semester || !lecturerId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if course code already exists
    const existing = await prisma.course.findUnique({ where: { code } });
    if (existing) {
      return res.status(409).json({
        error: `Course with code ${code} already exists`,
      });
    }

    const course = await prisma.course.create({
      data: {
        code,
        name,
        department,
        semester,
        lecturerId: Number(lecturerId),
      },
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (err) {
    next(err);
  }
};

// ─── GET ALL COURSES ─────────────────────────────────
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        // include the lecturer and their user info
        lecturer: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    res.json({ count: courses.length, courses });
  } catch (err) {
    next(err);
  }
};

// ─── GET COURSE BY ID ────────────────────────────────
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        lecturer: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        // include all enrolled students
        enrollments: {
          include: {
            student: {
              include: {
                user: { select: { name: true, email: true } },
              },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        error: `Course with id ${id} not found`,
      });
    }

    res.json({ course });
  } catch (err) {
    next(err);
  }
};

// ─── ENROLL STUDENT ──────────────────────────────────
const enrollStudent = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        error: "studentId and courseId are required",
      });
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: Number(studentId) },
    });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if already enrolled
    // findFirst is used here because we're checking two fields together
    const existing = await prisma.enrollment.findFirst({
      where: {
        studentId: Number(studentId),
        courseId: Number(courseId),
      },
    });

    if (existing) {
      return res.status(409).json({
        error: "Student is already enrolled in this course",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: Number(studentId),
        courseId: Number(courseId),
      },
    });

    res.status(201).json({
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCourse, getAllCourses, getCourseById, enrollStudent };
