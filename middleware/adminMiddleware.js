const jwt = require("jsonwebtoken");
require("dotenv").config();
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;


async function adminMiddleware(req,res,next)
{
  const token = req.headers.authorization;
  try
  {
      const response = await jwt.verify(token,ADMIN_JWT_SECRET);
      console.log(response);
      if(response)
      {
        req.adminId = response.id;
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
  adminMiddleware:adminMiddleware
}