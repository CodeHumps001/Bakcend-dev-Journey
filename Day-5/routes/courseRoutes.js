const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollStudent,
} = require("../controllers/courseController");

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.post("/enroll", enrollStudent);

module.exports = router;
