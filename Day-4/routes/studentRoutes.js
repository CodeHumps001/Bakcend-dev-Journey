const express = require("express");

const validateStudent = require("../middleware/validateStudents");
const router = express.Router();
const {
  getAllStudent,
  getStudentByCourse,
  getStudentById,
  deleteStudent,
  updateStudent,
  createStudent,
} = require("../controllers/studentController");

router.get("/course/:course", getStudentByCourse);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get("/", getAllStudent);
router.post("/", validateStudent, createStudent);

module.exports = router;
