const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      succes: false,
      message: "please fill all fileds",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User alreddy exist",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    succes: true,
    message: "User Register succesfully",
  });
};

// Login Api

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      succes: false,
      message: "Please provide Email or password",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      succes: false,
      message: "invalid caredetials",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      succes: false,
      message: "Invalid Crendetils",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    success: true,
    message: "User login Succesfully",
    token: token,
  });
};

module.exports = {
  registerUser,
  loginUser,
};
