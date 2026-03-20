const http = require("http");

//create a server
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  //display route logs
  console.log(`${method} ${url}`);

  //working on routes
  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to GeoAttend , check in with just a click!!");
  } else if (url === "/about") {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end(JSON.stringify({ developer: "Yaw Fosu", project: "GeoAttend" }));
  } else if (url === "/students") {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end(
      JSON.stringify(["Dorcas", "Samira", "Patience", "Princess", "Florence"]),
    );
  } else if (url === "/status") {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end(JSON.stringify({ status: "online", uptime: process.uptime() }));
  } else {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
