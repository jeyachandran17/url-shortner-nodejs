import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";
import cors from "cors";
import shortid from "shortid";

const app = express();

const PORT = 4000;

const MONGO_URL = "mongodb://127.0.0.1";
const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.use(express.json());
app.use(cors());

app.get('/', function (resquest, response) {
    response.send("🙋‍♂️, 🌏url shortner 🎊✨🤩");
})


app.get("/url/shorturlpage", async function (request, response) {
  const getdata = await client.db("b42wd2").collection("urls").find({}).toArray()
  response.send(getdata)
  console.log(getdata);
});

// post url storto db

app.post("/url/shorturlpage", async function (request, response) {
  const {urllink} =request.body;
  const urldata = {
    urllink:urllink,
    shorturl:`http://localhost:4000/${shortid.generate()}`,
    // clickcount: 0,
  }
  const result = await client.db("b42wd2").collection('urls').insertOne(urldata);
  response.send(result);
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  short url 

app.get("/url/:shortcode", async function (request, response) {
   
  const getdata = await client.db("b42wd2").collection("urls").find({shorturl: `http://localhost:4000/${request.params.shortcode}` })
  // const data = await client.db("b42wd2").collection("urls").updateOne({shorturl: `http://localhost:4000/${request.params.shortcode}` },{$set:{clickcount: getdata.clickcount +1 }} )
  response.redirect(getdata.urllink)  
});
     
    
  
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