const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ status: "User registered!" });
  } catch (err) {
    res.status(400).json({ error: "User already exists!" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found!" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ error: "Invalid password!" });

  const token = jwt.sign({ id: user._id }, "secretkey");
  res.json({ status: "Login successful", token });
});


  //  server codding

app.listen(5000, () => console.log(`Server running on port 5000`));



// database connection 

mongoose.connect("mongodb://localhost:27017/mern-authslogin");
console.log("database connected to mongodb database");
