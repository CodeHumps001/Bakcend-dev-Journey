## Day 5 — PostgreSQL, Prisma ORM & Real Database Integration

### Lesson 14: Why Databases Matter

- In-memory arrays reset on every server restart — not suitable for real apps
- PostgreSQL is a relational database — stores data in tables with relationships
- Foreign keys enforce data integrity — can't add attendance for non-existent student
- Handles concurrent users — 500 students marking attendance simultaneously

### Lesson 15: Prisma ORM

- ORM = Object Relational Mapper — interact with database using JavaScript not SQL
- Three parts: Schema (define models), Migrate (create tables), Client (query data)

**Setup**

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
npx prisma migrate dev --name init
```

**Five core operations**

```js
prisma.model.findMany(); // GET ALL
prisma.model.findUnique({ where: { id } }); // GET ONE
prisma.model.create({ data: {} }); // CREATE
prisma.model.update({ where: {}, data: {} }); // UPDATE
prisma.model.delete({ where: { id } }); // DELETE
```

**Relations**

```js
prisma.student.findUnique({
  where: { id: 1 },
  include: { user: true, enrollments: true },
});
```

**Key rules**

- Always use async/await with try/catch for Prisma queries
- Create one PrismaClient instance and export it — never create multiple
- Use Number() when converting req.params id — params are always strings
- Node.js v22 LTS is required — v24 has compatibility issues with Prisma v5

### Lesson 16: GeoAttend Real Database Integration

**Registration flow**

- Single endpoint handles all roles
- Role determines which profile gets created alongside the User
- STUDENT → creates User + Student profile
- LECTURER → creates User + Lecturer profile
- ADMIN → creates User only

**Password security**

```js
// Never store plain text passwords
const hashed = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
```

**GPS distance calculation**

- Haversine formula calculates real-world distance between two coordinates
- Session stores lecturer's GPS location and allowed radius
- Student's GPS checked against session location on mark attendance
- If within radius → PRESENT, if outside → ABSENT

**GeoAttend complete API routes**

- POST /api/auth/register
- POST /api/auth/login
- GET /api/students
- GET /api/students/:id
- GET /api/students/department/:department
- GET /api/students/:id/attendance/:courseId
- DELETE /api/students/:id
- GET /api/courses
- POST /api/courses
- POST /api/courses/enroll
- POST /api/attendance/session
- POST /api/attendance/mark
- GET /api/attendance/session/:sessionId
