## Day 3 — HTTP Servers & Express

### Lesson 8: The http Module

- Node.js can act as a web server using the built-in `http` module
- Every web interaction is a request/response cycle:
  - Client sends HTTP request
  - Server processes it and sends back a response

**Creating a raw HTTP server**

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Hello!" }));
});

server.listen(3000, () => console.log("Running on port 3000"));
```

- `req` — incoming request (url, method, headers, body)
- `res` — outgoing response
- `res.writeHead(statusCode, headers)` — set status and headers
- `res.end(data)` — send response and close connection
- `req.url` and `req.method` used for basic routing

**HTTP Status Codes**

- 200 — OK
- 201 — Created
- 400 — Bad Request
- 401 — Unauthorized
- 403 — Forbidden
- 404 — Not Found
- 500 — Internal Server Error

**Limitation of raw http** — routing requires long if/else chains.
Express solves this.

---

### Lesson 9: Introduction to Express

- Express is a minimal framework built on top of Node's http module
- Cleaner routing, automatic JSON handling, middleware support

**Setup**

```bash
npm init -y
npm install express
```

**Basic Express server**

```js
const express = require("express");
const app = express();

app.use(express.json()); // parse JSON request bodies

app.get("/", (req, res) => res.send("Hello!"));
app.listen(3000, () => console.log("Running"));
```

**Key response methods**

- `res.json({})` — sends JSON, sets Content-Type automatically
- `res.send()` — sends any response
- `res.status(404).json({})` — chain status with response

**Route Parameters — req.params**

```js
app.get("/students/:id", (req, res) => {
  const { id } = req.params;
  res.json({ id });
});
```

**Query Parameters — req.query**

```js
// GET /search?name=Yaw
app.get("/search", (req, res) => {
  const { name } = req.query;
  res.json({ name });
});
```

**Request Body — req.body**

```js
app.post("/students", (req, res) => {
  const { name, course } = req.body;
  res.status(201).json({ name, course });
});
```

**Wildcard 404 — must be last**

```js
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
```

---

### Lesson 10: Express Middleware

- Middleware is any function that runs between request arriving and response being sent
- Has access to req, res, and next
- Must call next() to pass control forward or send a response to end the cycle

**Middleware flow**

```
Request → [middleware 1] → [middleware 2] → [route handler] → Response
```

**Custom logger middleware**

```js
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode}`,
    );
  });
  next();
});
```

**Route-specific validation middleware**

```js
function validateStudent(req, res, next) {
  const { name, course } = req.body;
  if (!name || !course) {
    return res.status(400).json({ error: "name and course are required" });
  }
  next();
}

app.post("/students", validateStudent, (req, res) => {
  // only reaches here if validation passed
});
```

**Global error handling middleware — 4 parameters**

```js
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong" });
});
```

- Triggered by calling `next(err)` from anywhere
- Must be defined last, after all routes

**Key rules**

- Middleware order matters — defined before a route runs for that route
- Always call next() or send a response — never both
- Use return before error responses to prevent "headers already sent" crashes
- Push data before sending response, not after
- Use filter + includes for search, not find, to support partial matches
