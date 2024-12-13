const jwt = require("jsonwebtoken");
require("dotenv").config();
const USER_JWT_SECRET = process.env.USER_JWT_SECRET;


async function userMiddleware(req,res,next)
{
  const token = req.headers.authorization;
  try
  {
      const response = await jwt.verify(token,USER_JWT_SECRET);
      console.log(response);
      if(response)
      {
        req.userId = response.id;
        next();
      }
      else
      {
        res.status(403).json({
          message: "Incorrect credentials",
        });
      }

  }
  catch (err) {
    res.status(403).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  userMiddleware:userMiddleware
}