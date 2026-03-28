const prisma = require("../prisma/client");

// GET ALL STUDENTS
const getAllStudents = async (req, res, next) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });
    res.json({ count: students.length, students });
  } catch (err) {
    next(err);
  }
};

// GET STUDENT BY ID
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { name: true, email: true } },
        enrollments: { include: { course: true } },
        attendance: { include: { session: true } },
      },
    });

    if (!student) {
      return res.status(404).json({ error: `Student with id ${id} not found` });
    }

    res.json({ student });
  } catch (err) {
    next(err);
  }
};

// GET STUDENTS BY DEPARTMENT
const getStudentsByDepartment = async (req, res, next) => {
  try {
    const { department } = req.params;
    const students = await prisma.student.findMany({
      where: {
        department: { equals: department, mode: "insensitive" },
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

// DELETE STUDENT
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!student) {
      return res.status(404).json({ error: `Student with id ${id} not found` });
    }

    // Delete student profile first then user
    await prisma.student.delete({ where: { id: Number(id) } });
    await prisma.user.delete({ where: { id: student.userId } });

    res.json({ message: `Student ${student.user.name} has been removed` });
  } catch (err) {
    next(err);
  }
};

// GET STUDENT ATTENDANCE PERCENTAGE
const getAttendancePercentage = async (req, res, next) => {
  try {
    const { id, courseId } = req.params;

    const totalSessions = await prisma.session.count({
      where: { courseId: Number(courseId) },
    });

    if (totalSessions === 0) {
      return res
        .status(404)
        .json({ error: "No sessions found for this course" });
    }

    const attended = await prisma.attendance.count({
      where: {
        studentId: Number(id),
        session: { courseId: Number(courseId) },
        status: "PRESENT",
      },
    });

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
