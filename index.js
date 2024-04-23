import { readFile } from "fs";
import { join } from "path";
import { createServer } from "http";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://maharjan:maharjan123@cluster0.kmul092.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    let movies = await findOneListingByName("movie");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    console.log(movies);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function findOneListingByName( nameOfListing) {
  const result = await client
    .db("sample_mflix")
    .collection("movies")
    .findOne({ type: nameOfListing });

  if (result) {
    console.log(
      `Found a listing in the collection with the name '${nameOfListing}':`
    );
    console.log(result);
  } else {
    console.log(`No listings found with the name '${nameOfListing}'`);
  }
}

run().catch(console.dir);




createServer((req, res) => {
    if(req.url == "/"){
        readFile(join(__dirname,'/public','index.html'), 'utf-8', (err, data)=>{
            if (err) throw err;

            res.writeHead(200, {"Content-Type":"text/HTML"});
            res.end(data);
        })
    }else{
        res.write("not found");
        res.end();
    }
  })
  .listen(5959, () => console.log("server running"));
