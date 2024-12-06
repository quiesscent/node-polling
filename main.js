require('dotenv').config(); // Load environment variables
const express = require('express');
const db = require('./database'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.status(200).json({ message: 'Database connected successfully', time: result.rows[0].now });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Failed to connect to the database' });
    }
});


// Fetch all students 
app.get('/students', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM students');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});


// Add a student 
app.post('/students', async (req, res) => {
    const { name, email, age } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO students (name, email, age) VALUES ($1, $2, $3) RETURNING *',
            [name, email, age]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Failed to add student' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
