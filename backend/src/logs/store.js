class LogStore {
  constructor({ db }) {
    this.db = db;
  }
  // list
  async list() {
    return new Promise((resolve, reject) => {
      this.db.query("SELECT * FROM logs", (err, rows) => {
        if (err) return reject(err);
        resolve(
          rows.map((r) => ({
            ...r,
            context: JSON.parse(r.context),
          }))
        );
      });
    });
  }

  // create for logStore
  async create(type, context, userid) {
    await new Promise((resolve, reject) => {
      this.db.query(
        `INSERT into logs (type, context, userid) values(?, ?, ?)`,
        [type, JSON.stringify(context), userid],
        (err, rows, fields) => {
          if (err) throw err;
          resolve();
        }
      );
    });
  }
}

module.exports = LogStore;
