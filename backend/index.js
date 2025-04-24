// instantiation
const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 4000;

const cors = require("cors");

// import store/user/LogStore
const UserStore = require("./src/users/store");
const ItemStore = require("./src/items/store");
const LogStore = require("./src/logs/store");
const UserService = require("./src/users/service");
const ItemService = require("./src/items/service");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// databse connection
app.use((req, res, next) => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Eyzio!t!t6*ZdaLo",
    database: "mydb",
  });
  connection.connect();

  const userStore = new UserStore({ db: connection });
  const itemStore = new ItemStore({ db: connection });
  const logStore = new LogStore({ db: connection });
  const userService = new UserService({ userStore, logStore });
  const itemService = new ItemService({ itemStore, logStore });

  // app.use middleware
  req.context = {
    userStore,
    itemStore,
    logStore,
    userService,
    itemService,
  };

  res.on("finish", () => {
    connection.end();
  });
  next();
});

// protect middleware
const privateKey = "qwerty";

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const verify = jwt.verify(token, privateKey);
    console.log(verify);
    if (!verify?.sub) {
      return res.status(403).send("unauthorized");
    }
    req.user = verify;
    next();
  } catch (err) {
    res.status(403).send("unauthorized");
  }
};

// routing | register the route
app.use("/user", protect, require("./src/users/route"));
app.use("/item", protect, require("./src/items/route"));
app.use("/log", protect, require("./src/logs/route"));
app.use(require("./src/auth/route"));
app.use("/register", protect, require("./src/users/route"));

// start server
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
