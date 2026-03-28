require("dotenv").config();
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
// const attendanceRoutes = require("./routes/attendanceRoutes");
const express = require("express");
const app = express();

//logger
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}]  ${req.method} ${req.url} - ${res.statusCode}`,
    );
  });
  next();
});

//middleware to parse json body
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/auth", authRoutes);
// app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello welcome to geoAttend" });
  console.log("Welcome t0 geoattend");
});

//error to catch all unknow routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Routes not found" });
  console.log("Unknow routes");
});

//error handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong on the server" });
});

//listen app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("hey app  is running on post", PORT);
});
