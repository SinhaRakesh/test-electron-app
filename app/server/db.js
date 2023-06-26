const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const databasePath = path.join(__dirname, "data", "database.db"); // Update the path to match your folder structure

const db = new sqlite3.Database(databasePath, (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the database");
  }
});

module.exports = db;
