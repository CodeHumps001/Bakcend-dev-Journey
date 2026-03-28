const prisma = require("../prisma/client");

// START A SESSION (Lecturer)
const startSession = async (req, res, next) => {
  try {
    const { courseId, startTime, endTime, latitude, longitude, radiusMeters } =
      req.body;

    if (!courseId || !startTime || !endTime || !latitude || !longitude) {
      return res.status(400).json({ error: "All session fields are required" });
    }

    const session = await prisma.session.create({
      data: {
        courseId: Number(courseId),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        latitude: Number(latitude),
        longitude: Number(longitude),
        radiusMeters: radiusMeters ? Number(radiusMeters) : 100,
      },
    });

    res.status(201).json({ message: "Session started", session });
  } catch (err) {
    next(err);
  }
};

// MARK ATTENDANCE (Student)
const markAttendance = async (req, res, next) => {
  try {
    const { studentId, sessionId, latitude, longitude } = req.body;

    // Check session exists
    const session = await prisma.session.findUnique({
      where: { id: Number(sessionId) },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if already marked
    const existing = await prisma.attendance.findUnique({
      where: {
        studentId_sessionId: {
          studentId: Number(studentId),
          sessionId: Number(sessionId),
        },
      },
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "Attendance already marked for this session" });
    }

    // Calculate distance between student and session location
    const distance = getDistanceInMeters(
      session.latitude,
      session.longitude,
      Number(latitude),
      Number(longitude),
    );

    // Check if student is within allowed radius
    const status = distance <= session.radiusMeters ? "PRESENT" : "ABSENT";

    const attendance = await prisma.attendance.create({
      data: {
        studentId: Number(studentId),
        sessionId: Number(sessionId),
        latitude: Number(latitude),
        longitude: Number(longitude),
        status,
      },
    });

    res.status(201).json({
      message:
        status === "PRESENT"
          ? "Attendance marked successfully"
          : "You are too far from the class location",
      status,
      distanceMeters: Math.round(distance),
      attendance,
    });
  } catch (err) {
    next(err);
  }
};

// GET ATTENDANCE BY SESSION
const getSessionAttendance = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const records = await prisma.attendance.findMany({
      where: { sessionId: Number(sessionId) },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    res.json({ count: records.length, records });
  } catch (err) {
    next(err);
  }
};

// HAVERSINE FORMULA — calculates real-world distance between two GPS points
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = { startSession, markAttendance, getSessionAttendance };
