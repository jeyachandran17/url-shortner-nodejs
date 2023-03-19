import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";
import cors from "cors";
import shortid from "shortid";

const app = express();

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.use(express.json());
app.use(cors());

app.get('/', function (resquest, response) {
    response.send("🙋‍♂️, 🌏url shortner 🎊✨🤩");
})


app.get("/url", async function (request, response) {
  const getdata = await client.db("b42wd2").collection("urls").find({}).toArray()
  response.send(getdata)
  console.log(getdata);
});

// post url storto db

app.post("/url", async function (request, response) {
  const {url} =request.body;
  const urldata = {
    url:url,
    shorturl:`http://localhost:4000/${shortid.generate()}`,
    // clickcount: 0
  }
  const result = await client.db("b42wd2").collection('urls').insertOne(urldata);
  response.send(result);
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  short url 

// app.get("/url/:_id", async function (request, response) {
   
  // const getdata = await client.db("b42wd2").collection("urls").find({shorturl: `http://localhost:4000/${request.params._id}` })
  // const data = await client.db("b42wd2").collection("urls").updateOne({shorturl: `http://localhost:4000/${request.params._id}` },{$set:{clickcount: getdata.clickcount +1 }} )
  // response.redirect(getdata.url)  
// });
     
    
  
// app.delete("/shorturlpage/:id",async function(req, res) {
//   const {id} = req.params;
//   console.log(id)

//   try{
//     const getdata = await client.db("b42wd2").collection("urldetails").deleteOne({_id: new ObjectId(id) })
//     res.status(200).send({"status":" delete success"});
//   }
//   catch (err) {
//   res.status(400).send({"status" : "something went wrong" })
//   }
// })


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));