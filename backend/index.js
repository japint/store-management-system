require("dotenv").config();

// instantiation
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const contextMiddleware = require("./middlewares/contextMiddleware");

const app = express();
const PORT = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(contextMiddleware);

// JWT protect middleware
const privateKey = "qwerty";

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).send("No token provided");

    const verify = jwt.verify(token, privateKey);
    if (!verify?.sub) {
      return res.status(403).send("Unauthorized");
    }
    req.user = verify;
    next();
  } catch (err) {
    res.status(403).send("Unauthorized");
  }
};

// routing | register the route
app.use("/user", require("./src/users/route"));
app.use("/item", protect, require("./src/items/route"));
app.use("/log", protect, require("./src/logs/route"));
app.use(require("./src/auth/route"));

// start server
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
