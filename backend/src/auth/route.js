// import
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// instantiation
const app = express.Router();

const privateKey = "qwerty";

// login endpoint
app.post("/login", async (req, res) => {
  const { uid, pw } = req.body;
  //   TODO: validation if !user exist throw error
  // find the user in DB by uid
  const user = await req.context.userStore.getUserById(uid);
  if (!user) return res.status(401).send("User not found");

  const match = await bcrypt.compare(pw, user.pw);
  if (!match) return res.status(403).send("Invalid password");
  // const token = jwt.sign({ sub: user.uid }, privateKey);
  const token = jwt.sign({ sub: user.id }, privateKey);

  console.log(token);
  res.send({ token });
});

module.exports = app;
