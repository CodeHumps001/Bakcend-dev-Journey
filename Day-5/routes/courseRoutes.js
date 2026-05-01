const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollStudent,
} = require("../controllers/courseController");

// Anyone logged in can view courses
router.get("/", authenticate, getAllCourses);
router.get("/:id", authenticate, getCourseById);

// Only lecturers and admins can create courses
router.post("/", authenticate, authorize("LECTURER", "ADMIN"), createCourse);

// Any logged in user can enroll (admin enrolls students)
router.post("/enroll", authenticate, authorize("ADMIN"), enrollStudent);

module.exports = router;
