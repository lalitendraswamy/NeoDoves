const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE user (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)");
});

module.exports = db;
