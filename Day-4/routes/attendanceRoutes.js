const express = require("express");
const router = express.Router();
const {
  attendanceRecords,
  markAttendance,
} = require("../controllers/attendanceController");

const {
  validateAttendance,
  validateRecords,
} = require("../middleware/validateAttendance");

router.post("/mark", validateAttendance, markAttendance);
router.get("/:studentId", validateRecords, attendanceRecords);

module.exports = router;
