## Day 2 — Async JavaScript & File System Mastery

### Lesson 5: Promises

- A Promise is an object representing a value that isn't available yet
- Analogy: ordering food — you get a ticket (Promise), not the food immediately
- Three states: pending, fulfilled, rejected
- A Promise settles exactly once and never goes back

**Creating a Promise**

```js
const myPromise = new Promise((resolve, reject) => {
  if (success) resolve("value");
  else reject("error message");
});
```

**Consuming with .then() and .catch()**

```js
myPromise
  .then((result) => console.log(result))
  .catch((err) => console.log(err))
  .finally(() => console.log("Always runs"));
```

- `.then()` runs when fulfilled
- `.catch()` runs when rejected
- `.finally()` runs regardless of outcome
- `.then()` chains are flat — each receives the return value of the previous one
- This eliminates callback hell — no more nested pyramids

---

### Lesson 6: async/await

- `async/await` is not a new feature — it is cleaner syntax built on top of Promises
- Under the hood it is still Promises
- `async` marks a function as asynchronous and automatically wraps its return value in a Promise
- `await` pauses execution inside an async function until the Promise settles
- Code reads top to bottom like normal synchronous code

**Error handling with try/catch**

```js
async function run() {
  try {
    const result = await someAsyncOperation();
    console.log(result);
  } catch (err) {
    console.log("Error:", err.message);
  } finally {
    console.log("Done.");
  }
}
```

- `throw new Error()` inside an async function is the equivalent of `reject()` in a Promise
- `try` contains the happy path
- `catch` handles any error thrown inside try
- `finally` always runs — good for cleanup and completion messages

**Sequential vs Parallel**

```js
// Sequential — total time = sum of all delays
const a = await delay(1000);
const b = await delay(2000); // waits for a first

// Parallel — total time = longest single delay
const [a, b] = await Promise.all([delay(1000), delay(2000)]);
```

- Use `Promise.all` when operations don't depend on each other
- Critical for performance in real apps like GeoAttend

---

### Lesson 7: fs.promises

- Node's built-in Promise-based file system module
- No manual wrapping, no callbacks, no nesting

**Three ways to import**

```js
const fs = require("fs").promises;
const { readFile, writeFile } = require("fs").promises;
const { readFile, writeFile } = require("fs/promises"); // preferred
```

**Common methods**

```js
const data = await readFile("file.txt", "utf-8");
await writeFile("file.txt", "content"); // overwrites
await appendFile("file.txt", "more\n"); // adds to end
await unlink("file.txt"); // delete file
await rename("old.txt", "new.txt"); // rename/move
await mkdir("newfolder"); // create directory
```

**The production pattern**

```js
async function doSomething() {
  try {
    const data = await readFile("file.txt", "utf-8");
    await writeFile("output.txt", processedData);
  } catch (err) {
    console.log("Error:", err.message);
  }
}
```

---

### Day 2 Capstone: Student Registry v2

Rewrote the Day 1 Student Registry (callback-based) using async/await and fs/promises.

**Key upgrades:**

- Every command is its own named async function
- `fs/promises` destructured at the top
- `try/catch/finally` on every operation
- `throw new Error()` used to trigger catch blocks
- Flat, readable code — no nested callbacks

**Comparison**

|                | Day 1           | Day 2                  |
| -------------- | --------------- | ---------------------- |
| Style          | Callbacks       | async/await            |
| Error handling | if (err) return | try/catch/finally      |
| fs import      | require("fs")   | require("fs/promises") |
| Readability    | Nested pyramid  | Flat and clean         |

---

### Key Concepts Learned

- Callback hell is solved by Promises and async/await
- Always check for errors before using data
- `finally` is useful for completion messages and cleanup
- `Promise.all` runs operations in parallel — use it when operations are independent
- `throw new Error()` inside async functions triggers the nearest catch block
- Named async functions keep code organized and readable
