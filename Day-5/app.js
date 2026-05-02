require("dotenv").config();
const express = require("express");
const app = express();
const { sendError } = require("./utils/response");

// Import all route files
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

// Logger middleware — runs on every request
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode}`,
    );
  });
  next();
});

// Parse JSON request bodies
app.use(express.json());

// Mount routes — all auth routes live under /api/auth etc.
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendanceRoutes);

// 404 handler — catches any route that didn't match above
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler — must have 4 parameters
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  // Handle Prisma unique constraint violations
  // This happens when you try to insert a duplicate unique field
  if (err.code === "P2002") {
    return sendError(
      res,
      `${err.meta?.target?.[0] || "Field"} already exists`,
      409,
    );
  }

  // Handle Prisma record not found errors
  if (err.code === "P2025") {
    return sendError(res, "Record not found", 404);
  }

  // Generic server error
  return sendError(res, "Something went wrong on the server", 500, err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GeoAttend API running on port ${PORT}`);
});
