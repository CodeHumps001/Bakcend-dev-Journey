const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  startSession,
  markAttendance,
  getSessionAttendance,
} = require("../controllers/attendanceController");

// Only lecturers can start sessions
router.post(
  "/session",
  authenticate,
  authorize("LECTURER", "ADMIN"),
  startSession,
);

// Only students can mark attendance
router.post("/mark", authenticate, authorize("STUDENT"), markAttendance);

// Any logged in user can view attendance
router.get("/session/:sessionId", authenticate, getSessionAttendance);

module.exports = router;
