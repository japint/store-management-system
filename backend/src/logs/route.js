// import
const express = require("express");

// instantiation
const app = express.Router();

// routes/endpoints
// list/get
app.get("/", async (request, response) => {
  const logs = await request.context.logStore.list();
  response.json(logs);
});

module.exports = app;
