const http = require("http");
const fs = require("fs");
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");

const PORT = 9523;
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

/**
 * Get the appropriate content type according to the file.
 * 
 * @param {String} filePath Path for the file.
 * @returns Appropriate content type for the file.
 */
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

/**
 * Function to read the filepath.
 *
 * @param {Response} res
 * @param {String} filePath
 */
function readFile(res, filePath) {
  const contentType = getContentType(filePath);
  fs.readFile(filePath, "utf-8", (err, content) => {
    if (err) throw err;

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
}

/**
 * Function to fetch the products database.
 *
 * @param {Object} client Database client - Mongodb
 * @returns Array of products
 */
async function getProducts(client) {
  const cursor = client
    .db("online_shopping_site")
    .collection("products")
    .find({});
  return await cursor.toArray();
}

/**
 * Function to fetch the offers database.
 *
 * @param {Object}  client Database client - Mongodb
 * @returns Array of products
 */
async function getOffers(client) {
  const cursor = client
    .db("online_shopping_site")
    .collection("offers")
    .find({});
  return await cursor.toArray();
}

/**
 * Function to fetch the products and offers from database.
 *
 * @param {Object} client Database client - Mongodb
 * @returns Object of products array and offers array
 */
async function getProductsAndOffers(client) {
  const results = {
    products: await getProducts(client),
    offers: await getOffers(client),
  };
  return results;
}

client
  .connect()
  .then(() => {
    console.log("Successfully connected to MongoDB!");
    http
      .createServer(async (req, res) => {
        const { url } = req;
        // Allow CORS origin policy from anywhere
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept, X-Requested-with"
        );
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
          const result = await getProductsAndOffers(client);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } else if (url == "/api/products") {
          const result = await getProducts(client);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } else if (url == "/api/offers") {
          const result = await getOffers(client);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } else {
          const filePath = path.join(__dirname, "public", "404.html");
          readFile(res, filePath);
        }
      })
      .listen(PORT, () => console.log(`server running at port: ${PORT}`));
  })
  .catch((error) => {
    // Error while connecting to MongoDb Client.
    console.log("Failure to connect to MongoDb Client");
  });
