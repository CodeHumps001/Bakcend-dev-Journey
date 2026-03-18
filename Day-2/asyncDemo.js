const fs = require("fs").promises;
async function devidePromise(a, b) {
  if (b === 0) throw new Error("The value of b cannot be zerro");
  return a / b;
}

async function compute() {
  try {
    const good = await devidePromise(21, 3);
    console.log(good);
    const bad = await devidePromise(1 / 0);
    console.log(bad);
  } catch (err) {
    console.log("Error: ", err.message);
  } finally {
    console.log("program runs successfully");
    console.log("");
  }
}

compute();

//assignment 2

async function processStudents() {
  try {
    const studentList = await fs.readFile("student.txt", "utf-8");
    if (!studentList) throw new Error("File doesnt exist...");
    console.log(studentList);
    const totalStudent = studentList
      ? studentList.trim().split("\n").length
      : "";
    console.log("Total Student: ", totalStudent);
    const processDate = new Date();

    const report = await fs.writeFile(
      "report.txt",
      `Total students: ${totalStudent}\nProcessed at: ${processDate}`,
    );
  } catch (err) {
    console.log("Error: ", err.message);
  } finally {
    console.log("File done reading and report done generated!!");
  }
}

processStudents();

async function delay(ms) {
  setTimeout(() => console.log(`Starting process in ${ms}ms`), ms);
}
async function testParallel() {
  console.time("parallel");
  await Promise.all([delay(1000), delay(2000), delay(1000)]);
  console.timeEnd("parallel"); // should be ~2000ms not 4000ms
}

testParallel();
