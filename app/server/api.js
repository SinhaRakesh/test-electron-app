const express = require("express");
// const sqlite3 = require("sqlite3").verbose();

const app = express();

// // Connect to the SQLite database
// const db = new sqlite3.Database(":memory:", (err) => {
//   // const db = new sqlite3.Database("db/database.db", (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Connected to the SQLite database. 1");
// });
const db = require("./db.js");

// API endpoints or middleware
app.get("/users", async (req, res) => {
  // res.send({ res: "from user api" });
  // res.end();
  await db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

app.get("/users/setup", async (req, res) => {
  // Perform database operations using the db object
  await db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
    );

    db.run("INSERT INTO users (name) VALUES (?)", ["John Doe"], function (err) {
      if (err) {
        console.error("Error inserting user:", err.message);
      } else {
        console.log("User inserted with ID:", this.lastID);
      }
    });

    db.all("SELECT * FROM users", (err, rows) => {
      if (err) {
        console.error("Error retrieving users:", err.message);
      } else {
        console.log("Users:", rows);
      }
    });
  });

  res.send({
    res: "user table created",
  });
});

// // Start the server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`API server listening on port ${port}`);
// });

module.exports = app;
