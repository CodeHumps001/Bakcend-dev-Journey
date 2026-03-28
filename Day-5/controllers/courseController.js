const prisma = require("../prisma/client");

// CREATE COURSE
const createCourse = async (req, res, next) => {
  try {
    const { code, name, department, semester, lecturerId } = req.body;

    if (!code || !name || !department || !semester || !lecturerId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check duplicate course code
    const existing = await prisma.course.findUnique({ where: { code } });
    if (existing) {
      return res.status(409).json({ error: `Course ${code} already exists` });
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

    res.status(201).json({ message: "Course created", course });
  } catch (err) {
    next(err);
  }
};

// GET ALL COURSES
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
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

// ENROLL STUDENT IN COURSE
const enrollStudent = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: Number(studentId),
          courseId: Number(courseId),
        },
      },
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "Student already enrolled in this course" });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: Number(studentId),
        courseId: Number(courseId),
      },
    });

    res
      .status(201)
      .json({ message: "Student enrolled successfully", enrollment });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCourse, getAllCourses, enrollStudent };
