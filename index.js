const express = require("express")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const {userRouter} = require("./routes/user")
const {courseRouter} = require("./routes/course")
const {adminRouter} = require("./routes/admin")
const {userModel,courseModel,adminModel,purchaseModel} = require("./db")
require("dotenv").config();
const mongoURI = process.env.MONGODB_URI;
const app = express()
app.use(express.json())
app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);


async function main()
{
  const port = 3000;

  await mongoose.connect(mongoURI)
  .then(()=>{
    console.log("Connected to MongoDB")
  })
  .catch((error)=>{
    console.error("Error connecting to MongoDB",error)
  })

  app.listen(port,(req,res)=>{
    console.log(`Running on port ${port}`)
  }) 
}


main();