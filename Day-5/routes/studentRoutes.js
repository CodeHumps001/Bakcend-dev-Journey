const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  getStudentsByDepartment,
  deleteStudent,
  getAttendancePercentage,
} = require("../controllers/studentController");

// specific routes MUST come before dynamic routes
// otherwise /department/CS would match /:id with id = "department"
router.get("/department/:department", getStudentsByDepartment);
router.get("/:id/attendance/:courseId", getAttendancePercentage);
router.get("/:id", getStudentById);
router.get("/", getAllStudents);
router.delete("/:id", deleteStudent);

module.exports = router;
