const { attendanceData, students } = require("../data/data");

//mark attendance

const markAttendance = (req, res) => {
  const { studentId, courseId } = req.body;
  const newAttendance = { studentId, courseId, date: new Date().now };
  attendanceData.push(newAttendance);
  res.status(201).json({ message: `Student with id ${studentId} is marked` });
};

// find a student attendance record
const attendanceRecords = (req, res) => {
  const { studentId } = req.params;
  const records = attendanceData.filter(
    (att) => att.studentId === Number(studentId),
  );

  res.status(200).json({ count: records.length, records });
};

module.exports = { attendanceRecords, markAttendance };
