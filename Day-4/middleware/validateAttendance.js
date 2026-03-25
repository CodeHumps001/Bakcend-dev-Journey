const { attendanceData, students } = require("../data/data");

const validateAttendance = (req, res, next) => {
  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    res
      .status(401)
      .json({ error: "Student ID and courseId needed to take attendance" });
    console.log("Student ID and courseId needed to take attendance");
    return;
  }

  const currentStudent = students.find(
    (student) => student.id === Number(studentId),
  );
  if (!currentStudent) {
    res.status(404).json({ error: "Student not found" });
    console.log("Student not found");
    return;
  }

  next();
};

const validateRecords = (req, res, next) => {
  const { studentId } = req.params;

  const currentStudent = attendanceData.find(
    (att) => att.studentId === Number(studentId),
  );

  if (!currentStudent) {
    res.status(404).json({ error: "No records found" });
    console.log("No records found");
    return;
  }

  next();
};

module.exports = { validateAttendance, validateRecords };
