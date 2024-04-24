const http = require("http");
const fs = require("fs");
const path = require("path");
http
  .createServer((req, res) => {
    console.log(req.url);
    const {url} = req;
    if (req.url == "/") {
      console.log("in the root");
      fs.readFile(
        path.join(__dirname, "public", "index.html"),
        (err, content) => {
          if (err) throw err;

          res.writeHead(200, { "Content-Type": "text/html" });

          res.end(content);
        }
      );
    } else if (req.url == "/style.css") {
      console.log("in the css");
      fs.readFile(
        path.join(__dirname, "public", "style.css"),
        (err, content) => {
          if (err) throw err;

          res.writeHead(200, { "Content-Type": "text/css" });

          res.end(content);
        }
      );
    } else if (req.url == "/about") {
      fs.readFile(
        path.join(__dirname, "public", "about.html"),
        (err, content) => {
          if (err) throw err;

          res.writeHead(200, { "Content-Type": "text/html" });

          res.end(content);
        }
      );
    } else if (url.includes("/images/")) {
      console.log("in the images");
      const fileName = url.substring(8);
      console.log(fileName);
      serveStaticFile(res, fileName);
    } else if (req.url == "/api") {
      fs.readFile(path.join(__dirname, "public", "db.json"), (err, content) => {
        if (err) throw err;

        res.writeHead(200, { "Content-Type": "application/json" });

        res.end(content);
      });
    } else {
      res.write("Nothing changed");
    }
  })
  .listen(5959, () => console.log("server running"));

function serveStaticFile(res, fileName) {
  const filePath = path.join(__dirname, "public", "images", fileName);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
    } else {
      const contentType = getContentType(filePath);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case ".js":
      return "text/javascript";
    case ".css":
      return "text/css";
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
