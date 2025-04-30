const bcrypt = require("bcrypt");
class UserStore {
  constructor({ db }) {
    this.db = db;
  }

  // register a user
  async getUserByName(username) {
    return new Promise((resolve, reject) => {
      this.db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows[0]);
        }
      );
    });
  }

  async createUser({ name, pw, username }) {
    return new Promise((resolve, reject) => {
      this.db.query(
        "INSERT INTO users (name, pw, username) VALUES (?, ?, ?)",
        [name, pw, username],
        (err, result) => {
          if (err) return reject(err);
          resolve({ uid: result.insertId });
        }
      );
    });
  }

  // login
  async getUserByName(username) {
    return new Promise((resolve, reject) => {
      this.db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows[0]);
        }
      );
    });
  }

  // list/get
  async list() {
    return await new Promise((resolve) => {
      this.db.query("select * from users", (err, rows, fields) => {
        if (err) throw err;

        resolve(rows);
      });
    });
  }

  async get(id) {
    console.log("user id:", id);
    const results = await new Promise((resolve) => {
      this.db.query(
        `SELECT * from users WHERE uid = '${id}'`,
        (err, rows, fields) => {
          if (err) throw err;

          resolve(rows);
        }
      );
    });
    return results[0];
  }

  // ----------------homework----------------

  // create
  async create(user) {
    const { name } = user;
    await new Promise((resolve) => {
      this.db.query(
        `INSERT into users (name) values(?)`,
        [name],
        (err, rows, fields) => {
          if (err) throw err;
          console.log(rows);
          resolve();
        }
      );
    });
    const id = await new Promise((resolve) => {
      this.db.query(`SELECT LAST_INSERT_ID() as id;`, (err, rows, fields) => {
        if (err) throw err;
        resolve(rows[0].id);
      });
    });
    console.log({ id });
    return await this.get(id);
  }

  // update v1
  async update(uid, user) {
    const { name, username, pw } = user;

    // Hash password
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pw, saltRounds);

    await new Promise((resolve, reject) => {
      this.db.query(
        `UPDATE users SET name = ?, username = ?, pw = ? WHERE uid = ?`,
        [name, username, hashedPassword, uid],
        (err, rows, fields) => {
          if (err) throw err;
          // console.log(rows);
          resolve();
        }
      );
    });

    return { ...user, uid: uid };
  }

  // update v2
  // async update(uid, user) {
  //   console.log({ uid, user });
  //   const { name, username, pw } = user;

  //   return new Promise((resolve, reject) => {
  //     const values = [];
  //     let query = "UPDATE users SET";
  //     const fields = [];

  //     // Always update name
  //     fields.push(" name = ?");
  //     values.push(name);

  //     // Conditionally update username
  //     if (username) {
  //       fields.push(" username = ?");
  //       values.push(username);
  //     }

  //     // Conditionally update password
  //     const finalize = (finalValues) => {
  //       query += fields.join(",");
  //       query += " WHERE uid = ?";
  //       finalValues.push(uid);

  //       this.db.query(query, finalValues, (err, rows, fields) => {
  //         if (err) return reject(err);
  //         resolve({ ...user, itemid: uid });
  //       });
  //     };

  //     // If password update is needed, hash it first
  //     if (pw) {
  //       const bcrypt = require("bcrypt");
  //       const saltRounds = 10;
  //       bcrypt.hash(pw, saltRounds, (err, hashedPassword) => {
  //         if (err) return reject(err);
  //         fields.push(" pw = ?");
  //         values.push(hashedPassword);
  //         finalize(values);
  //       });
  //     } else {
  //       finalize(values);
  //     }
  //   });
  // }

  // delete
  async delete(id) {
    await new Promise((resolve) => {
      this.db.query(
        `DELETE from users WHERE uid = '${id}'`,
        (err, rows, fields) => {
          if (err) throw err;

          resolve(rows);
        }
      );
    });
  }

  hello() {}
}

module.exports = UserStore;
