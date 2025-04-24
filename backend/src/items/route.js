// import
const express = require("express");

// instantiation
const app = express.Router();

// routes/endpoints

// list/get
app.get("/", async (request, response) => {
  const item = await request.context.itemService.list();
  response.json(item);
});

// create
app.post("/", async (request, response) => {
  const item = await request.context.itemService.create(request.body);
  response.status(201).json(item);
});

// middleware only with /:id
app.use("/:id", async (request, response, next) => {
  const item = await request.context.itemService.get(request.params.id);
  if (!item) {
    response.status(404).send("User not found");
    return;
  }
  request.item = item;
  next();
});

// get
app.get("/:id", async (request, response) => {
  const item = await request.context.itemService.get(request.params.id);
  response.json(item);
});

// update
app.put("/:id", async (request, response) => {
  const item = await request.context.itemService.update(
    request.params.id,
    request.body
  );
  response.json(item);
});

// delete
app.delete("/:id", async (request, response) => {
  await request.context.itemService.delete(request.params.id);
  response.status(200).send("Data was deleted successfully");
});

// restock
app.post("/:id/restock", async (request, response) => {
  const item = await request.context.itemService.restock(
    request.params.id,
    request.body.qty
  );
  response.json(item);
});

// enable
app.post("/:id/enable", async (request, response) => {
  const item = await request.context.itemService.setEnabled(
    request.params.id,
    true
  );
  response.json(item);
});

// disable
app.post("/:id/disable", async (request, response) => {
  const item = await request.context.itemService.setEnabled(
    request.params.id,
    false
  );
  response.json(item);
});

module.exports = app;
