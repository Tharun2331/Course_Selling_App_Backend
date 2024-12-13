const mongoose = require("mongoose");
const schema = mongoose.Schema;
const objectId = schema.ObjectId;

const userSchema = new schema({
  email: {type:String, unique:true},
  password: String,
  firstName: String,
  lastName: String
})

const adminSchema = new schema({
  email: {type:String, unique:true},
  password: String,
  firstName: String,
  lastName: String
})

const courseSchema = new schema({
  title: String,
  description:String,
  price: Number,
  imageUrl: String,
  creatorId: objectId
})

const purchaseSchema = new schema({
  courseId: objectId,
  userId: objectId
})


const userModel = mongoose.model("user",userSchema);
const courseModel = mongoose.model("course",courseSchema);
const adminModel = mongoose.model("admin",adminSchema);
const purchaseModel = mongoose.model("purchase",purchaseSchema);


module.exports = {
  userModel:userModel,
  courseModel:courseModel,
  adminModel:adminModel,
  purchaseModel:purchaseModel
}

 