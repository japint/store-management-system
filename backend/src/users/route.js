// import
const express = require("express");

// instantiation
const app = express.Router();

const protect = require("../../index");

// routes/endpoints

// register endpoint
app.post("/register", async (req, res) => {
  try {
    const result = await req.context.userService.register(req.body);
    res.status(201).send(result.message);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// list users
app.get("/", async (req, res) => {
  const user = await req.context.userStore.list();
  res.send(user);
});

// ----------------homework----------------

// create
app.post("/", async (req, res) => {
  const user = await req.context.userService.create(req.body);
  res.status(201).json(user);
});

// middleware
app.use("/:id", async (request, response, next) => {
  const user = await request.context.userService.get(request.params.id);
  if (!user) {
    response.status(404).send("User not found");
    return;
  }
  request.user = user;
  next();
});

// get
app.get("/:id", async (req, res) => {
  res.send(req.user);
});

// update
app.put("/:id", async (req, res) => {
  const user = await req.context.userService.update(req.params.id, req.body);
  res.json(user);
});

// delete
app.delete("/:id", async (req, res) => {
  await req.context.userService.delete(req.params.id);
  res.send("Data was deleted successfully");
});

module.exports = app;
