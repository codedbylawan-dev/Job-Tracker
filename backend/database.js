// switched from better-sqlite3 (native build) to sqlite3 with promises
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { promisify } = require("util");

const db = new sqlite3.Database(path.join(__dirname, "jobtracker.db"));

// convert callback APIs to promises for async/await convenience
// db.run is special: sqlite3 stores lastID/changes on 'this' context
const original_run = db.run;
db.run = (sql, ...params) => {
  return new Promise((resolve, reject) => {
    original_run.call(db, sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

db.get = promisify(db.get.bind(db));
db.all = promisify(db.all.bind(db));
db.exec = promisify(db.exec.bind(db));

// helper so existing code that used db.prepare(sql).get()/all()/run()
// can continue using a similar interface
db.prepare = (sql) => {
  return {
    get: (...params) => db.get(sql, params),
    all: (...params) => db.all(sql, params),
    run: (...params) => db.run(sql, ...params),
  };
};

(async () => {
  try {
    await db.exec("PRAGMA journal_mode = WAL;");

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        company_name TEXT NOT NULL,
        job_role TEXT NOT NULL,
        job_url TEXT DEFAULT '',
        status TEXT DEFAULT 'Applied',
        applied_date DATE NOT NULL,
        notes TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
  } catch (err) {
    console.error("Database initialization error:", err);
  }
})();

module.exports = db;
