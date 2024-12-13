const express = require("express");
const app = express()
const Router = express.Router;
const adminRouter = Router();
require("dotenv").config()
const jwt = require("jsonwebtoken");
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const {adminModel, courseModel}= require("../db");
const {adminMiddleware} = require("../middleware/adminMiddleware");
const {z} = require("zod");
const bcrypt = require("bcrypt");
const course = require("../routes/course");


adminRouter.post("/signup", async (req, res) => {
  const requireBody = z.object({
    email: z.string().min(3).max(100).email(),
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
    password: z.string().min(3).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least one lowercase letter, one uppercase letter, and one special character (!@#$%^&*)"
    })
  });

  const parsedDataWithSuccess = requireBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    return res.status(400).json({
      message: "Incorrect input format",
      error: parsedDataWithSuccess.error.errors
    });
  }

  const { email, password, firstName, lastName } = parsedDataWithSuccess.data;

  try {
    // First check if admin already exists
    const existingAdmin = await adminModel.findOne({ email: email });
    if (existingAdmin) {
      return res.status(409).json({
        message: "Admin with this email already exists",
        error: "DUPLICATE_EMAIL"
      });
    }

    // If no existing admin, proceed with creation
    const hashedPassword = await bcrypt.hash(password, 5);
    const newAdmin = await adminModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    res.status(201).json({
      message: "Admin signed up successfully!",
      adminId: newAdmin._id
    });

  } catch (error) {
    console.error('Error in admin signup:', error);
    res.status(500).json({
      message: "Internal server error during signup",
      error: error.message
    });
  }
});

adminRouter.post("/signin", async (req,res)=>{
  const {email,password} = req.body;
  

  const admin = await adminModel.findOne({email:email});

    if(!admin)
      {
        return res.json({
          message: "Admin doesn't exist in your database"
        })
      }

    const passwordMatch = await bcrypt.compare(password,admin.password);

    if(passwordMatch)
    {
     const token =  jwt.sign({
        id: admin._id.toString()
      },
      ADMIN_JWT_SECRET
    );

    res.status(200).json({
      token: token
    })
    }

    else
    {
      return res.status(400).json({
        message: "Incorrect Credentials"
      })
    }


})

adminRouter.post("/course",adminMiddleware, async (req,res)=>{
  const adminId = req.adminId;
  const {title,description,imageUrl,price,creatorId} = req.body;
  
  await courseModel.create({
    title:title,
    description:description,
    imageUrl:imageUrl,
    price:price,
    creatorId:adminId
  })

  res.status(200).json({
    message:"Course got created!",
    courseId: course._id
  })

});

adminRouter.put("/course", adminMiddleware, async (req,res)=>{
  const adminId = req.adminId;
  const {title,description,price,imageUrl,courseId} = req.body;
  try
  {
    const course = await courseModel.updateOne({
      _id: courseId
    },
    {
    title:title,
    description:description,
    price:price,
    imageUrl:imageUrl
    })
  
  res.status(200).json({
    message:"Course got modified!",
    course:course._id
  })

  }

  catch(error)
  {
    res.status(500).json({
      message: "Internal Error!",
      error: error.message
    })
  }


})

adminRouter.get("/bulk",adminMiddleware, async (req,res)=>{
  const adminId = req.adminId;
  const courses = await courseModel.find({creatorId: adminId})
  res.status(200).json({
    message:"Courses list",
    course:courses
  })
})



module.exports = {
  adminRouter:adminRouter
}
