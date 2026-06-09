const db = require("./database");

const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        username TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS dreams (
        dream_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        dream_date DATE NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        ai_summary TEXT,
        is_favorite INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS tags (
        tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS dream_tags (
        dream_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (dream_id, tag_id),
        FOREIGN KEY (dream_id) REFERENCES dreams(dream_id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
      )
    `);

    const initialTags = [
      "lucid",
      "nightmare",
      "recurring",
      "flying",
      "falling",
      "chase",
      "prophetic",
      "healing",
      "adventure",
      "anxiety",
      "deceased",
      "water"
    ];

    const insertTag = db.prepare(`
      INSERT OR IGNORE INTO tags (name)
      VALUES (?)
    `);

    initialTags.forEach((tag) => {
      insertTag.run(tag);
    });

    insertTag.finalize();

    console.log("Database tables initialized");
  });
};

module.exports = initDb;