// class
class ItemStore {
  constructor({ db }) {
    this.db = db;
  }

  // list/get
  async list() {
    return new Promise((resolve, reject) => {
      this.db.query("SELECT * FROM items", (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async get(id) {
    console.log("item id:", id);
    const results = await new Promise((resolve) => {
      this.db.query(
        `SELECT * FROM items WHERE itemid = '${id}'`,
        (err, rows, fields) => {
          if (err) throw err;

          resolve(rows);
        }
      );
    });
    return results[0];
  }

  // create
  async create(item) {
    const { name, description, qty, enabled = true } = item;
    await new Promise((resolve, reject) => {
      this.db.query(
        `INSERT into items (name, description, qty, enabled) values(?, ?, ?, ?)`,
        [name, description, qty, enabled],
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
  async update(id, item) {
    const { name, description, qty, enabled } = item;
    await new Promise((resolve, reject) => {
      this.db.query(
        `UPDATE items SET name = ?, description = ?, qty = ?, enabled = ? WHERE itemid = ?`,
        [name, description, qty, enabled, id],
        (err, rows, fields) => {
          if (err) throw err;
          console.log(rows);
          resolve();
        }
      );
    });
    return { ...item, itemid: id };
  }

  // delete
  async delete(id) {
    await new Promise((resolve, reject) => {
      this.db.query(
        `DELETE from items WHERE itemid = ?`,
        [id],
        (err, rows, fields) => {
          if (err) throw err;
          resolve(rows);
        }
      );
    });
  }

  // restock
  async restock(id, qty) {
    await new Promise((resolve, reject) => {
      this.db.query(
        `UPDATE  items SET qty = qty + ? WHERE itemid = ?`,
        [qty, id],
        (err, rows, fields) => {
          if (err) throw err;
          resolve(rows);
        }
      );
    });
    return this.get(id);
  }

  // enabled
  async setEnabled(id, enabled) {
    await new Promise((resolve, reject) => {
      this.db.query(
        `UPDATE items SET enabled = ? WHERE itemid = ?`,
        [enabled, id],
        (err, rows, fields) => {
          if (err) throw err;
          resolve();
        }
      );
    });
    return this.get(id);
  }
}

module.exports = ItemStore;
