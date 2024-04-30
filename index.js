const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const craftData = require('./crafts.json');
// middleware


const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());


const port = process.env.PORT || 5000;
// ********************************************
  
app.get("/", (req, res) => {
  res.send("server is running");
});
   // 6 cards 
   app.get('/craftCard',(req,res)=>{
    res.send(craftData)
  })

  app.get('/craftCard/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const craftItem = craftData.find(item => item.id === id) || {};
    res.send(craftItem);
  });
  
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.tostkkh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect(); 
    const craftsCollection = client.db("craftsDB").collection("crafts");
    const subcategoryCollection = client.db("craftsDB").collection("subcategory");
    // ***************************

 app.get('/subcategory', async(req,res)=>{
  const cursor = subcategoryCollection.find()
  const result = await cursor.toArray()
  res.send(result)
 }) 

 //
 // get category name 
app.get('/craftsByCategory/:categoryName', async (req, res) => {
  const categoryName = req.params.categoryName;
  const result = await craftsCollection.find({ subcategoryName: categoryName }).toArray();
  res.json(result);
});

  // ************************************
    // POST
    app.post("/addCrafts", async (req, res) => {
      const craftData = req.body;
      const result = await craftsCollection.insertOne(craftData);
      res.send(result);
    });

    // GET
    app.get("/myCrafts/:email", async (req, res) => {
      // console.log(req.params)
      const result = await craftsCollection.find({email : req.params.email}).sort({price:1}).toArray();
      res.send(result);
    });

    app.get('/crafts',(async(req,res)=>{
      const cursor = craftsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    }))

    // *************************************************************
    // Update
    app.get('/update/:id',async(req,res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await craftsCollection.findOne(query)
      res.send(result)
    })
     
    // UPDATE
    app.put('/crafts/:id',async(req,res)=>{
      const id = req.params.id 
      const crafts = req.body
      // console.log(crafts)
      const filter = {_id: new ObjectId(id)}
      const options= {upsert:true}
      const updateCraftInfo={
        $set:{
          image:crafts.image,
          itemName:crafts.itemName,
          subcategoryName:crafts.subcategoryName,
          description:crafts.description,
          price:crafts.price,
          rating:crafts.rating,
          customization:crafts.customization,
          processingTime:crafts.processingTime,
          stockStatus:crafts.stockStatus,
          userEmail:crafts.userEmail,
          userName:crafts.userName,

        }
      }
const result = await craftsCollection.updateOne(filter,updateCraftInfo,options)
    })
// **********************************************************************
    // Delete 
    app.delete('/crafts/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await craftsCollection.deleteOne(query)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`my server running on port ${port}`);
});


// CraftStore

// CraftStore is an online platform dedicated to artists and craft enthusiasts, offering a wide range of resources, tools, and inspiration for painting and drawing.

// 🎨 Live Site: CraftStore

// ********Features *****

