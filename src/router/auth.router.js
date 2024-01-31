const express = require("express");
const router = express.Router();
const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      return res
        .status(400)
        .json({ message: "user already exist", success: false });
    }
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    // await user.save((err, data) => {
    //   if (err) console.log("something went wrong");
    // });
    return res
      .status(200)
      .json({ message: "user registered successfully", success: true });
  } catch (err) {
    console.log("registration failed", err);
    return res.status(500).json({ error: "something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; //destructuring
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = await jwt.sign(
      { user, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );
    return res.json({
      message: "login successfull",
      success: "true",
      token,
      email,
    });
  } catch (err) {
    console.log("login failed", err);
    return res.status(500).json({ error: "something went wrong" });
  }
});

router.get("/isloggedin", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: "token required" });
    }
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    //console.log(decoded);
    const user = await User.findOne({ _id: decoded.user._id });
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    return res.status(200).json({
      message: "user logged in",
      success: true,
      email: user.email,
    });
  } catch (err) {
    console.log("something went wrong", err);
    return res.status(500).json({ error: "something went wrong" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(400).json({ error: "token required" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decoded.user._id });
    if (!user) {
      res.status(400).json({ error: "user not found" });
    }
    res.status(200).json({ message: "user logged out", success: true });
  } catch (err) {
    console.log("something went wrong", err);
    return res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = router;
