// import
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// instantiation
const app = express.Router();

const privateKey = "qwerty";

// login endpoint
app.post("/login", async (req, res) => {
  const { name, pw } = req.body;
  try {
    //   TODO: validation if !user exist throw error
    // find the user in DB by uid
    const user = await req.context.userStore.getUserByName(name);
    if (!user) return res.status(401).send("User not found");

    const match = await bcrypt.compare(pw, user.pw);
    if (!match) return res.status(403).send("Invalid password");
    // const token = jwt.sign({ sub: user.uid }, privateKey);
    const token = jwt.sign({ sub: user.id }, privateKey, { expiresIn: "30d" });
    res.send({
      token,
      user: {
        uid: user.uid,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = app;
