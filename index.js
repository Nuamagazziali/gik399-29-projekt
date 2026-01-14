// Importera paket
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

// Skapa app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Koppla till databasen
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Skapa tabell om den inte finns
db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL
  )
`);

// Test-route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// ---------------- CRUD ----------------

app.get("/items", (req, res) => {
    const sql = "SELECT * FROM items";
  
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

// CREATE – skapa ny
app.post("/items", (req, res) => {
  const { name, category, color } = req.body;

  const sql = `
    INSERT INTO items (name, category, color)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [name, category, color], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      id: this.lastID,
      message: "Item created successfully",
    });
  });
});

// UPDATE – uppdatera
app.put("/items", (req, res) => {
  const { id, name, category, color } = req.body;

  const sql = `
    UPDATE items
    SET name = ?, category = ?, color = ?
    WHERE id = ?
  `;

  db.run(sql, [name, category, color, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({ message: "Item updated successfully" });
  });
});

// DELETE – ta bort
app.delete("/items/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM items WHERE id = ?";

  db.run(sql, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({ message: "Item deleted successfully" });
  });
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
