const { time } = require("console");
const { writeFile, readFile, appendFile } = require("fs/promises");

const command = process.argv[2];
const message = process.argv[3];
const file = "activity.log";

//adding or appending logs to activity.logs
async function logMessage() {
  // validate message
  if (!message) {
    console.log("Please provide a message to log.");
    return;
  }
  try {
    //creating log time
    const timestamp = new Date().toISOString();
    //append file
    await appendFile(file, `[${timestamp}] ${message}\n`);

    console.log("Logs added succesffuly");
  } catch (err) {
    console.log("Error: ", err.message);
  } finally {
    console.log("Done logging");
  }
}

// show logs

async function showLogs() {
  try {
    let data = "";

    //read file
    try {
      data = await readFile(file, "utf-8");
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    //convert logs to arrays or list
    const logData = data
      ? data
          .trim()
          .split("\n")
          .filter((l) => l)
      : [];

    //display logs details
    console.log("======= ACTIVITY LOGS ========");

    //check if there is empty logs
    if (logData.length === 0) {
      console.log("There is no logs available");
      return;
    }

    //display logs with number
    logData.forEach((log, i) => {
      console.log(`${i + 1}. ${log}`);
    });
  } catch (err) {
    console.log("Error: ", err.message);
  } finally {
    console.log("Done displaying logs");
  }
}

//clear logs
async function clearLogs() {
  try {
    // overwrite file with empty content
    await writeFile(file, "");

    console.log("All logs cleared successfully");
  } catch (err) {
    console.log("Error:", err.message);
  } finally {
    console.log("Done clearing logs");
  }
}

if (command === "log") {
  logMessage();
} else if (command === "show") {
  showLogs();
} else if (command === "clear") {
  clearLogs();
} else {
  console.log("Invalid Coomand");
}
