const express= require('express');
const app =express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors=require('cors');
require('dotenv').config()
const port =process.env.PORT ||5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kct9xpl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    const usersCollection = client.db("YogaSchool").collection("users");
    const classesCollection = client.db("YogaSchool").collection("classes");
    const instructorsCollection = client.db("YogaSchool").collection("instructors");




    //  class  api
    app.get("/classes", async (req, res) => {
      const classes = await classesCollection.find({}).sort({availableSeats :-1}).toArray();
        
        
      res.send(classes);
    });
    app.get("/instructors", async (req, res) => {
      const classes = await instructorCollection.find({}).toArray();
        
        
      res.send(classes);
    });
    
    

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'already exists' })
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
  }
}
run().catch(console.dir);




app.get ('/',(req,res)=>{
    res.send('Yoga school server is running ')
})

app.listen(port,()=>{
    console.log(`Yoga school server  running on port ${port}`)
})