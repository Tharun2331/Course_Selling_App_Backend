const express = require("express");
const Router = express.Router;
const courseRouter = Router();
const {courseModel,purchaseModel} = require("../db")
const {userMiddleware} = require("../middleware/userMiddleware")


courseRouter.post("/purchase",userMiddleware, async (req,res)=>{
  const userId = req.userId;
  const courseId = req.body.courseId;

  const purchases = await purchaseModel.create({
    userId,
    courseId
  })

  res.status(200).json({
    message:"You have successfully bought the course!",
    purchases:purchases
    
  })

})

courseRouter.get("/preview", async (req,res)=>{
  const courses =  await courseModel.find({})

  res.status(200).json({
    message:" Course Page",
    courses
  })
})



module.exports = {
  courseRouter:courseRouter
}