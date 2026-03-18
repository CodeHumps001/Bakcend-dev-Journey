const os = require("os");

module.exports = {
  platform: os.platform(),
  hostname: os.hostname(),
  cpuCount: os.cpus().length,
};
