let { students } = require("../data/data");

//get all students

const getAllStudent = (req, res) => {
  res.json({ count: students.length, students });
};

//get student with ID
const getStudentById = (req, res, next) => {
  try {
    const { id } = req.params;
    const currentStudent = students.find(
      (student) => student.id === Number(id),
    );
    if (!currentStudent) {
      res.status(401).json({ error: `Student with id ${id} is not found` });
      console.log(`Student with id ${id} is not found`);
    }
    res.json({ currentStudent });
    console.log(currentStudent);
  } catch (err) {
    next(err);
  }
};

//add a new student
const createStudent = (req, res) => {
  const { name, address, email, course } = req.body;
  const newId = students.length + 1;
  const newStudent = { id: newId, name, address, email, course };

  students.push(newStudent);

  console.log("Student Created:", newStudent);
  res.status(201).json(newStudent);
};

//update a student details id
const updateStudent = (req, res) => {
  const { id } = req.params;
  const { name, address, email, course } = req.body;

  const currentStudent = students.find((student) => student.id === Number(id));

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
};

//delete a student id
const deleteStudent = (req, res) => {
  const { id } = req.params;
  const currentStudent = students.find((student) => student.id === Number(id));

  if (!currentStudent) {
    console.log(`Student with id ${id} not found`);
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  students = students.filter((student) => student.id !== Number(id));

  console.log(`Student ${currentStudent.name} has been removed`);
  res
    .status(200)
    .json({ message: `Student ${currentStudent.name} has been removed` });
};

// get student by course
const getStudentByCourse = (req, res) => {
  const { course } = req.params;
  const findStudentCourse = students.filter(
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
};

module.exports = {
  getAllStudent,
  getStudentByCourse,
  getStudentById,
  deleteStudent,
  updateStudent,
  createStudent,
};
