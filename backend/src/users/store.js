class UserStore {
  constructor({ db }) {
    this.db = db;
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

  // update
  async update(id, user) {
    console.log({ id, user });
    const { name } = user;
    const results = await new Promise((resolve) => {
      this.db.query(
        `UPDATE users SET name = ? WHERE uid = ?`,
        [name, id],
        (err, rows, fields) => {
          if (err) throw err;

          resolve();
        }
      );
    });
    return { ...user, itemid: id };
  }

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
