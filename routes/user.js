
const express = require("express");
const Router = express.Router;
const jwt = require("jsonwebtoken");
const userRouter = Router();
require("dotenv").config();
const USER_JWT_SECRET = process.env.USER_JWT_SECRET;
const { userModel, courseModel, purchaseModel } = require("../db");
const {userMiddleware} = require("../middleware/userMiddleware")
const {z} = require("zod")
const bcrypt = require("bcrypt");
const course = require("./course");

userRouter.post("/signup", async (req, res) => {
  const requireBody = z.object({
    email: z.string().min(3).max(100).email(),
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
    password: z.string().min(3).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least one lowercase letter, one uppercase letter, and one special character (!@#$%^&*)",
    })
  });

  const parsedDataWithSuccess = requireBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.status(400).json({
      message: "Incorrect input format",
      error: parsedDataWithSuccess.error.errors,
    });
    return;
  }

  const { email, password, firstName, lastName } = parsedDataWithSuccess.data;
  let errorThrown = false;

  try {
    const hashedPassword = await bcrypt.hash(password, 5);

    await userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (e) {
    res.status(409).json({
      message: "User already exists",
    });
    errorThrown = true;
  }

  if (!errorThrown) {
    res.status(201).json({
      message: "You are signed up!",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await userModel.findOne({
    email: email,
  });

  if (!user) {
    return res.status(403).json({
      message: "User does not exist in our database",
    });
  }

  const userPasswordMatch = await bcrypt.compare(password, user.password);
  if (userPasswordMatch) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      USER_JWT_SECRET
    );

    res.status(200).json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }
});

userRouter.get("/purchases",userMiddleware,async (req,res)=>{
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId:userId
  })

  const courses = await courseModel.find({
    _id: {$in: purchases.map(x=> x.courseId)}
  })

  res.json({
    message: "Purchases",
    purchases,
    courses
  })
})



module.exports = {
  userRouter:userRouter
}