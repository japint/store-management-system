// import
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// instantiation
const app = express.Router();

const privateKey = "qwerty";

// login endpoint
app.post("/login", async (req, res) => {
  const { username, pw } = req.body;
  console.log("Login attempt username:", username); // Log username sent in request
  try {
    //   TODO: validation if !user exist throw error
    // find the user in DB by uid
    const user = await req.context.userStore.getUserByName(username);

    if (!user) return res.status(401).send("Invalid username or password");
    false;

    const match = await bcrypt.compare(pw, user.pw);
    if (!match) return res.status(403).send("Invalid password");
    // const token = jwt.sign({ sub: user.uid }, privateKey);
    const token = jwt.sign({ sub: user.uid }, privateKey, { expiresIn: "30d" });
    res.send({
      token,
      user: {
        uid: user.uid,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = app;
