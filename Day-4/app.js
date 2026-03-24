require("dotenv").config();
const express = require("express");
const app = express();
const studentRoutes = require("./routes/studentRoutes");
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode}`,
    );
  });
  next();
});

app.use(express.json());
app.use("/api/students", studentRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
