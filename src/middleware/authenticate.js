// require("dotenv").config();
// const JSON_SECRET = process.env.JSON_SECRET;
const JWT = require("jsonwebtoken");
const User = require("../models/User");

const authentication = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decode = JWT.verify(token, "this is my secret");
    const user = await User.findOne({ where: { userId: decode.userId } });
    if (!user) {
      return res.status(401).json({ message: "user no found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authentication;
