# Node.js Learning Journey

## Day 1 — Foundations

### Lesson 1: What is Node.js?

- Node.js is a runtime environment that lets you run JavaScript outside the browser
- It uses the V8 engine (same as Chrome) embedded into a standalone program
- Before Node.js, JavaScript could only run in the browser

**Non-Blocking I/O**

- Traditional servers are blocking — they wait for one operation to finish before handling the next
- Node.js uses an event loop — a single thread that never sits idle
- Instead of waiting, it delegates slow operations (file reads, DB calls) and moves on
- When the operation is ready, a callback fires with the result
- This is why Node.js can handle thousands of simultaneous connections efficiently

**Node.js vs Browser**

- No `window` or `document` in Node.js
- Node.js can read/write files, run servers, access the OS
- Same JavaScript syntax
- `process` is the Node.js global object — equivalent of `window` in the browser
- `process.env` is used to store secrets like JWT keys and database URLs

---

### Lesson 2: CommonJS Modules

- Modules let you split code into separate files and share functionality between them
- Node.js uses the CommonJS (CJS) module system by default

**Exporting**

```js
module.exports = { add, subtract };
```

**Importing**

```js
const { add, subtract } = require("./math");
```

- `./` means look in the same folder
- No `./` means look in `node_modules` (third-party packages)
- Each file gets its own private scope — variables don't leak between files
- You only share what you explicitly export

**Three export patterns**

- Export an object (most common)
- Export a single function
- Export a class

**Core built-in modules** — no installation needed, just require by name:

- `fs` — read/write files
- `path` — work with file paths
- `os` — information about the operating system
- `http` — create servers

---

### Lesson 3: npm & package.json

- npm (Node Package Manager) is the world's largest software registry
- Every serious Node.js project has a `package.json` — the identity card of the project
- Tracks project name, version, dependencies, and scripts

**Initialize a project**

```bash
npm init -y
```

**Install a package**

```bash
npm install package-name
```

**Run a package without global install**

```bash
npx package-name
```

**dependencies vs devDependencies**

- `dependencies` — packages the app needs to run in production
- `devDependencies` — tools only needed during development (e.g. nodemon)
- Install a devDependency with `--save-dev` flag

**node_modules**

- Never commit to Git
- Add to `.gitignore`
- Anyone cloning the project runs `npm install` to restore it

**npm scripts**

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

```bash
npm start
npm run dev
```

---

### Lesson 4: The fs Module

- Built-in module for reading, writing, updating, and deleting files
- Two versions of every method: synchronous (blocking) and asynchronous (non-blocking)
- In real apps, always prefer async

**Reading a file**

```js
fs.readFile("file.txt", "utf-8", (err, data) => {
  if (err) return console.log(err.message);
  console.log(data);
});
```

**Writing a file** — overwrites if file exists

```js
fs.writeFile("file.txt", content, (err) => {
  if (err) return console.log(err.message);
});
```

**Appending to a file**

```js
fs.appendFile("file.txt", "new line\n", (err) => {
  if (err) return console.log(err.message);
});
```

**Important rules**

- Always check for errors before using `data`
- Use `return` after logging an error to stop further execution
- `err.code === "ENOENT"` means file not found — handle it separately when needed

**Callback Hell**

- When async operations depend on each other, they must be nested inside each other's callbacks
- Creates a deeply nested pyramid structure — hard to read and maintain
- This problem motivated the creation of Promises and async/await

---

### Day 1 Project: Student Registry CLI

Built a command-line student registry with four commands:

```bash
node command.js add "Name"
node command.js list
node command.js count
node command.js remove "Name"
```

**Concepts applied:**

- `process.argv` to read terminal arguments
- `fs.readFile`, `fs.writeFile`, `fs.appendFile`
- Proper async sequencing with nested callbacks
- Error handling before using data
- `err.code !== "ENOENT"` to handle missing file gracefully on first add
- Duplicate prevention on add
- "Not found" check on remove
- Extracting repeated values (file path) into a variable
