const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode}`,
    );
  });
  next();
});
app.use(express.json());

//students data
const students = [
  { id: 1, name: "Yaw Fosu", course: "CS" },
  { id: 2, name: "Ama Serwaa", course: "Business" },
  { id: 3, name: "Kofi Mensah", course: "Math" },
  { id: 4, name: "Abena Boateng", course: "CS" },
  { id: 5, name: "Kwame Appiah", course: "Physics" },
  { id: 6, name: "Akosua Adobea", course: "Nursing" },
  { id: 7, name: "Ekow Baidoo", course: "Engineering" },
  { id: 8, name: "Adjoa Osei", course: "Economics" },
  { id: 9, name: "Nana Yaw", course: "CS" },
  { id: 10, name: "Efua Mansa", course: "Arts" },
];

//validate function
function validateStudent(req, res, next) {
  const { id, name, course } = req.body;
  if (!id || !name || !course) {
    return res.status(400).json({ error: "name and course are required" });
  }
  next();
}

app.get("/", (req, res) => {
  res.send("Welcome to geoAttend");
});

app.get("/students", (req, res) => {
  res.json({ students });
});
app.get("/students/:id", (req, res) => {
  const { id } = req.params;
  const data = students.find((n) => n.id === Number(id));
  res.json({ data });
});

app.get("/search", (req, res) => {
  const { name } = req.query;
  const data = students.find((n) => n.name === name);
  res.json(data);
});

app.post("/students", validateStudent, (req, res) => {
  const { id, name, course } = req.body;
  students.push({ id, name, course });
  res.status(201).json({ id, name, course });
  console.log({ id, name, course });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
  console.log("404 -  Route not found");
});

//error handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(3000, () => {
  console.log("app running on PORT 3000");
});
