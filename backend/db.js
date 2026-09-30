const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'app.db');
const modelPath = path.join(__dirname, 'model.sql');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database:', dbPath);
  }
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  const rowPromise = new Promise((resolve, reject) => {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='artists'", (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  rowPromise.then((row) => {
    if (!row) {
      const sql = fs.readFileSync(modelPath, 'utf8');
      db.exec(sql, (err) => {
        if (err) {
          console.error('Error running model.sql:', err.message);
        } else {
          console.log('Database tables created and seeded from model.sql');
        }
      });
    }
  }).catch((err) => console.error('Database setup error:', err.message));
});

module.exports = db;
