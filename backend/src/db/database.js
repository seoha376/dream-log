require("dotenv").config();

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(process.env.DATABASE_PATH);
console.log(process.env.DATABASE_PATH);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("SQLite connection failed:", err.message);
  } else {
    console.log("SQLite connected:", dbPath);
  }
});

db.run("PRAGMA foreign_keys = ON");

module.exports = db;