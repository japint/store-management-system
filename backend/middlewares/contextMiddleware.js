require("dotenv").config();

const mysql = require("mysql");
// import store/user/LogStore
const UserStore = require("../src/users/store");
const ItemStore = require("../src/items/store");
const LogStore = require("../src/logs/store");
const UserService = require("../src/users/service");
const ItemService = require("../src/items/service");

// databse connection
const contextMiddleware = (req, res, next) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  connection.connect((err) => {
    if (err) {
      console.error("DB connection failed:");
      console.error(err.code); // Like ER_ACCESS_DENIED_ERROR
      console.error(err.sqlMessage);
      return res.status(500).send("DB connection error");
    }

    const userStore = new UserStore({ db: connection });
    const itemStore = new ItemStore({ db: connection });
    const logStore = new LogStore({ db: connection });
    const userService = new UserService({ userStore, logStore });
    const itemService = new ItemService({ itemStore, logStore });

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
};

module.exports = contextMiddleware;
