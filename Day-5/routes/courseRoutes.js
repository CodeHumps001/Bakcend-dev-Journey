const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  enrollStudent,
} = require("../controllers/courseController");

router.get("/", getAllCourses);
router.post("/", createCourse);
router.post("/enroll", enrollStudent);

module.exports = router;
