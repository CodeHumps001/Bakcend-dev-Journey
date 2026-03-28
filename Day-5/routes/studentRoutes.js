const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  getStudentsByDepartment,
  deleteStudent,
  getAttendancePercentage,
} = require("../controllers/studentController");

router.get("/", getAllStudents);
router.get("/department/:department", getStudentsByDepartment);
router.get("/:id", getStudentById);
router.get("/:id/attendance/:courseId", getAttendancePercentage);
router.delete("/:id", deleteStudent);

module.exports = router;
