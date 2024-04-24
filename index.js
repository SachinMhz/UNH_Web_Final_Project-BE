const http = require("http");
const fs = require("fs");
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");

const PORT = 8523;
const URI =
  "mongodb+srv://maharjan:maharjan123@cluster0.kmul092.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");

    http
      .createServer(async (req, res) => {
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
        } else if (url == "/api/products") {
          const cursor = await client
            .db("bookdb")
            .collection("bookcollection")
            .find({});
          const result = await cursor.toArray();
          const response = { data: result, status: 200, message: "success" };

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        } else {
          // File not found error.
          res.write("Nothing changed");
        }
      })
      .listen(PORT, () => console.log(`server running at port: ${PORT}`));
  } catch {
    // Ensures that the client will close when you finish/error
    console.log("Connection closing");
    await client.close();
  }
}

run().catch(console.dir);
