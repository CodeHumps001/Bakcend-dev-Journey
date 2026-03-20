const express = require("express");
const app = express();

// Creating an in-memory database
let studentData = [];

// Logger middleware
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode}`,
    );
  });
  next();
});

// Middleware to parse json body
app.use(express.json());

// GET all students plus counts
app.get("/api/students", (req, res) => {
  res.json({ counts: studentData.length, students: [...studentData] });
});

// GET student with a specific id
app.get("/api/students/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const currentStudent = studentData.find(
      (student) => student.id === Number(id),
    );

    if (!currentStudent) {
      console.log(`Student with id ${id} not found`);
      return res.status(404).json({ error: `Student with id ${id} not found` });
    }

    res.json({ currentStudent });
    console.log(currentStudent);
  } catch (err) {
    next(err);
  }
});

// Validation middleware
const validateStudent = (req, res, next) => {
  const { name, address, email, course } = req.body;
  const uniqueStudent = studentData.find((student) => student.email === email);

  if (!name || !address || !email || !course) {
    console.log("name, email, and address are required");
    return res
      .status(400)
      .json({ error: "name, email, and address are required" });
  } else if (uniqueStudent) {
    console.log(`User with this email: ${email} already exists`);
    return res
      .status(400)
      .json({ error: `User with this email: ${email} already exists` });
  }
  next();
};

// POST: Adding student to memory
app.post("/api/students", validateStudent, (req, res) => {
  const { name, address, email, course } = req.body;
  const newId = studentData.length + 1;
  const newStudent = { id: newId, name, address, email, course };

  studentData.push(newStudent);

  console.log("Student Created:", newStudent);
  res.status(201).json(newStudent);
});

// DELETE: Remove student from memory
app.delete("/api/student/:id", (req, res) => {
  const { id } = req.params;
  const currentStudent = studentData.find(
    (student) => student.id === Number(id),
  );

  if (!currentStudent) {
    console.log(`Student with id ${id} not found`);
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  studentData = studentData.filter((student) => student.id !== Number(id));

  console.log(`Student ${currentStudent.name} has been removed`);
  res
    .status(200)
    .json({ message: `Student ${currentStudent.name} has been removed` });
});

// GET: View students by course
app.get("/api/students/course/:course", (req, res) => {
  const { course } = req.params;
  const findStudentCourse = studentData.filter(
    (student) => student.course.toLowerCase() === course.toLowerCase(),
  );

  if (findStudentCourse.length === 0) {
    console.log(`There is no student registered under ${course}`);
    return res
      .status(404)
      .json({ error: `There is no student registered under ${course}` });
  }

  res.json({ findStudentCourse });
  console.log(findStudentCourse);
});

// PUT: Update a student
app.put("/api/student/:id", (req, res) => {
  const { id } = req.params;
  const { name, address, email, course } = req.body;

  const currentStudent = studentData.find(
    (student) => student.id === Number(id),
  );

  if (!currentStudent) {
    console.log(`Student with id ${id} not found`);
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  // Update fields
  currentStudent.name = name || currentStudent.name;
  currentStudent.email = email || currentStudent.email;
  currentStudent.address = address || currentStudent.address;
  currentStudent.course = course || currentStudent.course;

  console.log("Updated Student:", currentStudent);
  res.json({ message: "Update successful", student: currentStudent });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
  console.log("404 -  Route not found");
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(3000, () => {
  console.log("App listening on port :3000");
});
