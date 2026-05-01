const express = require("express");
const router = express.Router();
const {
  startSession,
  markAttendance,
  getSessionAttendance,
} = require("../controllers/attendanceController");

router.post("/session", startSession);
router.post("/mark", markAttendance);
router.get("/session/:sessionId", getSessionAttendance);

module.exports = router;
