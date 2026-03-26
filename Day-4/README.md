## Day 4 — Project Structure, Environment Variables & MVC

### Lesson 11: Environment Variables & dotenv

- Environment variables keep secrets out of source code
- Never hardcode passwords, API keys, or database URLs in code
- Git history is permanent — even deleted secrets can be found

**Setup**

```bash
npm install dotenv
```

```js
// Must be first line in app.js
require("dotenv").config();
```

**`.env` file**

```
PORT=3000
NODE_ENV=development
JWT_SECRET=yourSecretKey
DB_URL=postgresql://user:pass@localhost/dbname
```

**Accessing variables**

```js
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
```

**Rules**

- `.env` always goes in `.gitignore`
- Create `.env.example` with same keys but empty values
- Always provide fallback values for non-sensitive variables using `||`
- `.env.example` IS committed — it's a template for other developers

---

### Lesson 12: Express Router

- One big file doesn't scale — split routes into separate files
- `express.Router()` creates a mini-app with its own routes
- Mount routers on the main app with `app.use()`

**Creating a router**

```js
// routes/studentRoutes.js
const express = require("express");
const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
```

**Mounting routers**

```js
// app.js
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);
```

- Routes in the router file are relative to the mount path
- `router.get("/")` mounted at `/api/students` = `GET /api/students`
- `router.get("/:id")` mounted at `/api/students` = `GET /api/students/:id`

---

### Lesson 13: MVC Pattern

MVC = Model, View, Controller

| Layer      | Responsibility          | In Node.js APIs           |
| ---------- | ----------------------- | ------------------------- |
| Model      | Data and database logic | Prisma/database queries   |
| View       | What the user sees      | JSON responses            |
| Controller | Business logic          | Request handler functions |

**Controller pattern**

```js
// controllers/studentController.js
const getAllStudents = (req, res) => {
  res.json({ students });
};

const getStudentById = (req, res) => {
  const { id } = req.params;
  const student = students.find((s) => s.id === Number(id));
  if (!student) return res.status(404).json({ error: "Not found" });
  res.json({ student });
};

module.exports = { getAllStudents, getStudentById };
```

**Routes become one-liners**

```js
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
```

**Production folder structure**

```
project/
├── .env
├── .env.example
├── app.js
├── data/
│   └── mockData.js
├── routes/
│   └── studentRoutes.js
├── controllers/
│   └── studentController.js
└── middleware/
    └── validateStudent.js
```

**Key benefits**

- Routes file is clean — just one line per route
- Logic is easy to find and edit
- Controllers can be tested independently
- Same structure scales from 5 routes to 500 routes
- Direct blueprint for GeoAttend's backend architecture
