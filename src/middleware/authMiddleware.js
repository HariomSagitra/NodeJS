const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId).select("-password");

      //req.user = decoded;
      
      req.user = user

      next();
    } else {
      return res.status(401).json({
        succes: false,
        message: "NO Token provided",
      });
    }
  } catch (error) {

    console.log(error);

    return res.status(401).json({
      succes: false,
      message: "Invalid token",
    });
  }
};

module.exports = protect;