const prisma = require("../prisma/client");

// ─── GET ALL STUDENTS ────────────────────────────────
const getAllStudents = async (req, res, next) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        // include fetches the related User data alongside each student
        user: {
          // select means only return these specific fields from User
          // we never want password coming back in any response
          select: { name: true, email: true, role: true },
        },
      },
    });

    res.json({ count: students.length, students });
  } catch (err) {
    next(err);
  }
};

// ─── GET STUDENT BY ID ───────────────────────────────
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { name: true, email: true } },
        // fetch all courses this student is enrolled in
        enrollments: {
          include: { course: true },
        },
        // fetch all attendance records for this student
        attendance: {
          include: { session: true },
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        error: `Student with id ${id} not found`,
      });
    }

    res.json({ student });
  } catch (err) {
    next(err);
  }
};

// ─── GET STUDENTS BY DEPARTMENT ──────────────────────
const getStudentsByDepartment = async (req, res, next) => {
  try {
    const { department } = req.params;

    const students = await prisma.student.findMany({
      where: {
        department: {
          equals: department,
          mode: "insensitive", // case insensitive — "cs" matches "CS"
        },
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (students.length === 0) {
      return res.status(404).json({
        error: `No students found in ${department} department`,
      });
    }

    res.json({ count: students.length, students });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE STUDENT ──────────────────────────────────
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!student) {
      return res.status(404).json({
        error: `Student with id ${id} not found`,
      });
    }

    // Delete student profile first — then delete the user
    // Order matters here because User has Student linked to it
    // Deleting User first would violate the foreign key constraint
    await prisma.student.delete({ where: { id: Number(id) } });
    await prisma.user.delete({ where: { id: student.userId } });

    res.json({ message: `Student ${student.user.name} has been removed` });
  } catch (err) {
    next(err);
  }
};

// ─── GET ATTENDANCE PERCENTAGE ───────────────────────
const getAttendancePercentage = async (req, res, next) => {
  try {
    const { id, courseId } = req.params;

    // Count total sessions for this course
    const totalSessions = await prisma.session.count({
      where: { courseId: Number(courseId) },
    });

    if (totalSessions === 0) {
      return res.status(404).json({
        error: "No sessions found for this course yet",
      });
    }

    // Count how many sessions this student attended
    const attended = await prisma.attendance.count({
      where: {
        studentId: Number(id),
        session: { courseId: Number(courseId) },
        status: "PRESENT",
      },
    });

    // Calculate percentage and round to 1 decimal place
    const percentage = ((attended / totalSessions) * 100).toFixed(1);

    res.json({
      studentId: Number(id),
      courseId: Number(courseId),
      totalSessions,
      attended,
      percentage: `${percentage}%`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentsByDepartment,
  deleteStudent,
  getAttendancePercentage,
};
