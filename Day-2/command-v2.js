const { readFile, appendFile, writeFile } = require("fs/promises");
const { exit } = require("process");

const command = process.argv[2];
const name = process.argv[3];
const file = "student.txt";

//creating helper functions

//list command
async function listAll() {
  try {
    const data = await readFile(file, "utf-8");
    if (!data) throw new Error("File not availabe");

    console.log(data ? data : []);
  } catch (err) {
    console.log("Error: ", err.message);
  } finally {
    console.log("Process done");
  }
}

//adding student
async function addingStudent() {
  try {
    //read file
    const data = await readFile(file, "utf-8");

    //loop through file to get available student
    const availableStudent = data ? data.trim().split("\n") : "";
    //check if new student is inside
    const isExist = availableStudent.includes(name);
    if (isExist) {
      throw new Error(`Student with name ${name} already exist in file`);
    }
    //add student to list
    await appendFile(file, `${name}\n`);
    console.log(`Student with name ${name} Added`);
  } catch (err) {
    console.log("Error: ", err.message);
  } finally {
    console.log("DONE!!!");
  }
}
//count students
async function countStudent() {
  try {
    //read student file
    const data = await readFile(file, "utf-8");
    if (!data) throw new Error("File not availabe");
    //convert to list and check lemght as coundt
    const totalStudent = data ? data.trim().split("\n").length : [];
    console.log(`Regstered Student(s): ${totalStudent}`);
  } catch (err) {
    console.log("Error: ", err.message);
  } finally {
    console.log("Process done");
  }
}

//removing a student
async function removeStudent() {
  try {
    //read file
    const data = await readFile(file, "utf-8");

    //view all students
    const allStudents = data ? data.trim().split("\n") : [];
    //check if name exist
    const isExist = allStudents.includes(name);
    if (isExist) {
      //filter student except name
      const newData = allStudents.filter((n) => n !== name).join("\n");
      //write overwrite file with new data
      await writeFile(file, `${newData}\n`);
      console.log(`Student with name ${name} has successfully been removed`);
    } else {
      throw new Error(`${name} doesn't exist in file...`);
    }
  } catch (err) {
    console.log("Error: ", err.message);
  } finally {
    console.log("Done Removing Student");
  }
}

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
