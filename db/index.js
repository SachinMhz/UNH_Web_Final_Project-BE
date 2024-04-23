
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

async function createDbConnection() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}


export default{
    client,
    createDbConnection
}