const express = require("express");
const router = express.Router();

// Creating an in-memory database
let studentData = [];

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

// GET all students plus counts
router.get("/", (req, res) => {
  res.json({ counts: studentData.length, students: [...studentData] });
});

// GET student with a specific id
router.get("/:id", (req, res, next) => {
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
// POST: Adding student to memory
router.post("/", validateStudent, (req, res) => {
  const { name, address, email, course } = req.body;
  const newId = studentData.length + 1;
  const newStudent = { id: newId, name, address, email, course };

  studentData.push(newStudent);

  console.log("Student Created:", newStudent);
  res.status(201).json(newStudent);
});

// DELETE: Remove student from memory
router.delete("/:id", (req, res) => {
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
router.get("/course/:course", (req, res) => {
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
router.put("/:id", (req, res) => {
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

module.exports = router;
