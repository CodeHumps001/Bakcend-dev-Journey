## Day 7 — Validation, Consistent Responses & Advanced Prisma

### Consistent API Responses

- Every response follows the same shape — frontend developers can rely on it
- Success: `{ success: true, message, data }`
- Error: `{ success: false, message, error }`

**Response helper**

```js
// utils/response.js
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const sendError = (res, message, statusCode = 400, error = null) => {
  const response = { success: false, message };
  if (error !== null) response.error = error;
  return res.status(statusCode).json(response);
};
```

### Input Validation with Zod

- Zod validates request body shape before it reaches the controller
- Define schema once — reuse everywhere
- Returns field-level errors automatically

**Installation**

```bash
npm install zod
```

**Defining a schema**

```js
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "LECTURER", "ADMIN"]),
});
```

**Validation middleware**

```js
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = {};
    result.error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return sendError(res, "Validation failed", 400, errors);
  }
  req.body = result.data;
  next();
};
```

**Applying to routes**

```js
router.post("/register", validate(registerSchema), register);
```

### Advanced Prisma

**Pagination**

```js
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
const skip = (page - 1) * limit;

const [data, total] = await Promise.all([
  prisma.model.findMany({ skip, take: limit }),
  prisma.model.count(),
]);
```

**Search/Filter**

```js
const where = search ? { name: { contains: search, mode: "insensitive" } } : {};

prisma.model.findMany({ where });
```

**Prisma error codes**

- P2002 — unique constraint violation (duplicate email etc.)
- P2025 — record not found

### Middleware Order on Routes

```js
// Order matters — left to right
router.post(
  "/register",
  validate(schema), // 1. validate body first
  register, // 2. only runs if validation passes
);

router.get(
  "/students",
  authenticate, // 1. check token
  authorize("ADMIN"), // 2. check role
  getAllStudents, // 3. only runs if both pass
);
```
