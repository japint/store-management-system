// import
const express = require("express");
const jwt = require("jsonwebtoken");

// instantiation
const app = express.Router();

const privateKey = "qwerty";

// routes/endpoints
app.post("/login", async (req, res) => {
  //   TODO: validation if !user exist throw error
  // const token = jwt.sign({ sub: user.uid }, privateKey);
  const token = jwt.sign({ sub: req.body.uid }, privateKey);
  console.log(token);
  res.send({ token });
});

module.exports = app;
