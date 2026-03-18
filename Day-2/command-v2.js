// importing promise-based file system methods
const { readFile, appendFile, writeFile } = require("fs/promises");

const command = process.argv[2]; // command from CLI (add, list, count, remove)
const name = process.argv[3]; // student name from CLI
const file = "student.txt"; // file to store student names

// ======================= LIST ALL STUDENTS =======================
async function listAll() {
  try {
    // try to read file
    let data = "";

    try {
      data = await readFile(file, "utf-8");
    } catch (err) {
      // if file doesn't exist, treat as empty (not an error)
      if (err.code !== "ENOENT") throw err;
    }

    // convert file content into array
    const students = data
      ? data
          .trim()
          .split("\n")
          .filter((n) => n)
      : [];

    console.log("   Registered Students   ");
    console.log("--------------------------");

    // check if list is empty
    if (students.length === 0) {
      console.log("No students found.");
      return;
    }

    // print students nicely
    students.forEach((s, i) => {
      console.log(`${i + 1}. ${s}`);
    });
  } catch (err) {
    console.log("Error:", err.message);
  } finally {
    console.log("Process done");
  }
}

// ======================= ADD STUDENT =======================
async function addingStudent() {
  // validate input
  if (!name) {
    console.log("Please provide a student name.");
    return;
  }

  try {
    let data = "";

    try {
      data = await readFile(file, "utf-8");
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    // get existing students
    const students = data
      ? data
          .trim()
          .split("\n")
          .filter((n) => n)
      : [];

    // check if student already exists
    if (students.includes(name)) {
      console.log(`Student ${name} already exists.`);
      return;
    }

    // add new student
    await appendFile(file, `${name}\n`);
    console.log(`Student ${name} added successfully`);
  } catch (err) {
    console.log("Error:", err.message);
  } finally {
    console.log("DONE!!!");
  }
}

// ======================= COUNT STUDENTS =======================
async function countStudent() {
  try {
    let data = "";

    try {
      data = await readFile(file, "utf-8");
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    // convert to array
    const students = data
      ? data
          .trim()
          .split("\n")
          .filter((n) => n)
      : [];

    console.log(`Registered Student(s): ${students.length}`);
  } catch (err) {
    console.log("Error:", err.message);
  } finally {
    console.log("Process done");
  }
}

// ======================= REMOVE STUDENT =======================
async function removeStudent() {
  // validate input
  if (!name) {
    console.log("Please provide a student name.");
    return;
  }

  try {
    let data = "";

    try {
      data = await readFile(file, "utf-8");
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    // get all students
    const students = data
      ? data
          .trim()
          .split("\n")
          .filter((n) => n)
      : [];

    // check if student exists
    if (!students.includes(name)) {
      console.log(`${name} does not exist in the file.`);
      return;
    }

    // remove student
    const newData = students.filter((n) => n !== name).join("\n");

    // overwrite file with updated list
    await writeFile(file, newData + (newData ? "\n" : ""));
    console.log(`Student ${name} has been removed successfully`);
  } catch (err) {
    console.log("Error:", err.message);
  } finally {
    console.log("Done Removing Student");
  }
}

// ======================= COMMAND HANDLER =======================
if (command === "list") {
  listAll();
} else if (command === "add") {
  addingStudent();
} else if (command === "count") {
  countStudent();
} else if (command === "remove") {
  removeStudent();
} else {
  console.log("Invalid Command");
}
