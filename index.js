const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8523;

function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

function readFile(res, filePath) {
  const contentType = getContentType(filePath);
  fs.readFile(filePath, (err, content) => {
    if (err) throw err;

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
}

http
  .createServer((req, res) => {
    const { url } = req;

    if (url == "/") {
      const filePath = path.join(__dirname, "public", "index.html");
      readFile(res, filePath);
    } else if (url == "/style.css") {
      const filePath = path.join(__dirname, "public", "style.css");
      readFile(res, filePath);
    } else if (url.includes("/images/")) {
      const fileName = url.substring(8);
      const filePath = path.join(__dirname, "public", "images", fileName);
      readFile(res, filePath);
    } else if (url == "/api") {
      fs.readFile(path.join(__dirname, "public", "db.json"), (err, content) => {
        if (err) throw err;

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(content);
      });
    } else {
      // File not found error.
      res.write("Nothing changed");
    }
  })
  .listen(PORT, () => console.log(`server running at port: ${PORT}`));
