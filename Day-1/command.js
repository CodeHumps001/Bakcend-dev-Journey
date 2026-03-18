const fs = require("fs");

const command = process.argv[2];
const name = process.argv[3];
const file = "report.txt";

// ADD
if (command === "add") {
  if (!name) {
    console.log("Please provide a name to add.");
    return;
  }

  console.log("Adding:", name);

  fs.readFile(file, "utf-8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.log("Error reading file:", err.message);
      return;
    }

    const names = data
      ? data
          .trim()
          .split("\n")
          .filter((n) => n)
      : [];

    if (names.includes(name)) {
      console.log("Name already exists in file.");
      return;
    }

    fs.appendFile(file, `${name}\n`, (err) => {
      if (err) {
        console.log("Error appending name:", err.message);
        return;
      }

      console.log(`${name} added successfully`);
    });
  });
}

// LIST
else if (command === "list") {
  fs.readFile(file, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err.message);
      return;
    }

    const names = data
      ? data
          .trim()
          .split("\n")
          .filter((n) => n)
      : [];

    console.log("   Registered Names   ");
    console.log("------------------------");

    if (names.length === 0) {
      console.log("No names found.");
      return;
    }

    names.forEach((n, i) => {
      console.log(`${i + 1}. ${n}`);
    });
  });
}

// COUNT
else if (command === "count") {
  console.log("Counting...");

  fs.readFile(file, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err.message);
      return;
    }

    const names = data
      ? data
          .trim()
          .split("\n")
          .filter((n) => n)
      : [];

    console.log(`Total number of students: ${names.length}`);
  });
}

// REMOVE
else if (command === "remove") {
  if (!name) {
    console.log("Please provide a name to remove.");
    return;
  }

  console.log("Removing:", name);

  fs.readFile(file, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err.message);
      return;
    }

    const names = data
      ? data
          .trim()
          .split("\n")
          .filter((n) => n)
      : [];

    if (!names.includes(name)) {
      console.log("User not found.");
      return;
    }

    const newList = names.filter((n) => n !== name);

    fs.writeFile(file, newList.join("\n"), (err) => {
      if (err) {
        console.log("Error writing file:", err.message);
        return;
      }

      console.log(`${name} removed successfully`);
    });
  });
}

// UNKNOWN COMMAND
else {
  console.log("Unknown command.");
}
