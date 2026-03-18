const { addition, subtraction } = require("../math.js");
const info = require("../info.js");
const chalk = require("chalk");
const fs = require("fs");

console.log(process.argv);

// console.log(chalk.yellow.bold("=== System Info"));
// console.log(
//   chalk.blue(`${info.platform} \n${info.hostname} \n${info.cpuCount}`),
// );

// console.log(chalk.yellow.bold("=== Maths ==="));
// console.log(chalk.green(addition(4, 6)));
// console.log(chalk.green(subtraction(4, 6)));
