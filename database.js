const { Pool } = require('pg');

// Configure the PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres', // Replace with your username
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'test', // Replace with your database name
    password: process.env.DB_PASSWORD || 'password', // Replace with your password
    port: process.env.DB_PORT || 5432,
});

// Export the pool for use in the app
module.exports = {
    query: (text, params) => pool.query(text, params),
};


const createTables = async () => {
    try {
        // Create students table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                age INT NOT NULL
            );
        `);
        console.log('Students table created.');

        // Create candidates table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS candidates (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                party VARCHAR(100) NOT NULL
            );
        `);
        console.log('Candidates table created.');

        // Create votes table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id SERIAL PRIMARY KEY,
                student_id INT NOT NULL,
                candidate_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
                CONSTRAINT unique_vote UNIQUE (student_id)
            );
        `);
        console.log('Votes table created.');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        // Close the pool
        await pool.end();
    }
};

// Execute the script
createTables()
    .then(() => console.log('All tables created successfully.'))
    .catch((error) => console.error('Error executing table creation:', error));