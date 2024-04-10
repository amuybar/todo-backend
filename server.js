const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Create SQLite database and connect to it
const db = new sqlite3.Database('todos.db');

// Create table for todos if not exists
db.run("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)");

app.use(express.json());
app.use(cors());

// Routes
app.get('/todos', (req, res) => {
    console.log('GET /todos');
    db.all("SELECT * FROM todos", (err, rows) => {
        if (err) {
            console.error('Error fetching todos:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Todos fetched successfully');
            res.json(rows);
        }
    });
});

app.post('/todos', (req, res) => {
    const { task } = req.body;
    console.log('POST /todos:', task);
    db.run("INSERT INTO todos (task) VALUES (?)", [task], function(err) {
        if (err) {
            console.error('Error adding todo:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Todo added successfully:', { id: this.lastID, task });
            res.status(201).json({ id: this.lastID, task });
        }
    });
});
// Update an existing todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  console.log(`PUT /todos/${id}`, task);
  db.run("UPDATE todos SET task = ? WHERE id = ?", [task, id], function(err) {
      if (err) {
          console.error('Error updating todo:', err);
          res.status(500).send('Internal Server Error');
      } else if (this.changes === 0) {
          console.error('Todo not found');
          res.status(404).send('Todo not found');
      } else {
          console.log('Todo updated successfully');
          res.status(200).json({ id: Number(id), task });
      }
  });
});

// Delete an existing todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /todos/${id}`);
  db.run("DELETE FROM todos WHERE id = ?", id, function(err) {
      if (err) {
          console.error('Error deleting todo:', err);
          res.status(500).send('Internal Server Error');
      } else if (this.changes === 0) {
          console.error('Todo not found');
          res.status(404).send('Todo not found');
      } else {
          console.log('Todo deleted successfully');
          res.status(204).end();
      }
  });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
