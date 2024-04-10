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

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
