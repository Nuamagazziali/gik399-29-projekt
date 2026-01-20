const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


const db = new sqlite3.Database(
  path.join(__dirname, "database.db")
);

db.serialize(() => {
  db.run("PRAGMA journal_mode = WAL;");
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      color TEXT NOT NULL
    )
  `);
});

app.get("/items", (req, res) => {
  db.all("SELECT * FROM items", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/items", (req, res) => {
  const { name, category, color } = req.body;
  db.run(
    "INSERT INTO items (name, category, color) VALUES (?, ?, ?)",
    [name, category, color],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

app.put("/items/:id", (req, res) => {
  const { name, category, color } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE items SET name=?, category=?, color=? WHERE id=?",
    [name, category, color, id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.delete("/items/:id", (req, res) => {
  db.run("DELETE FROM items WHERE id=?", req.params.id, err => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
