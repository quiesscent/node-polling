const express = require('express');
const app = express();
const prisma = require('./prisma');
const bcrypt = require('bcrypt');

// Middleware
app.use(express.json());

// Define the PORT
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {

    res.json({ message: "Welcome to Polling site" })
    
});


// Create a new student
app.post('/register', async (req, res) => {
    const { name, course, reg, password, campus } = req.body;
    try {
        // Check if the user already exists
        const existingStudent = await prisma.student.findUnique({ where: { reg } });

        if (existingStudent) {
            return res.status(400).json({ error: 'Student already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = await prisma.student.create({

            data: { name, course, reg, password: hashedPassword, campus }

        });

        res.status(201).json(newStudent);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// create a new candidate
app.post('/register/candidate', async (req, res) => {
    const { name, course, reg, password, campus, post, candidateId } = req.body;
    try {
        // Check if the user already exists
        const existingCandidate = await prisma.candidate.findUnique({ where: { reg } });

        if (existingCandidate) {
            return res.status(400).json({ error: 'Candidate already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newCandiate = await prisma.candidate.create({
            data: { name, course, reg, password: hashedPassword, campus, post, candidateId },
        });

        res.status(201).json(newCandiate);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { reg, password } = req.body;

    try {
        // Find the user by email
        const user = await prisma.student.findUnique({ where: { reg } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid User' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, reg: user.reg } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Login candidate endpoint
app.post('/login/candidate', async (req, res) => {
    const { candidateId, password } = req.body;

    try {
        // Find the user by email
        const user = await prisma.candidate.findUnique({ where: { candidateId } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid User' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, candidateId: user.candidateId } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all candidates
app.get('/students', async (req, res) => {
    try {
        const candidates = await prisma.candidate.findMany();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Vote for a candidate
app.post('/vote', async (req, res) => {
    const { studentId, candidateId } = req.body;
    try {
        // Check if the student already voted
        const existingVote = await prisma.vote.findUnique({
            where: { studentId },
        });

        if (existingVote) {
            return res.status(400).json({ error: 'Student has already voted' });
        }

        // Record the vote
        const vote = await prisma.vote.create({
            data: {
                studentId,
                candidateId,
            },
        });

        res.status(201).json({ message: 'Vote recorded successfully', vote });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to record vote' });
    }
});

// Get voting results
app.get('/results', async (req, res) => {
    try {
        const results = await prisma.candidate.findMany({
            include: {
                votes: true,
            },
        });
        const formattedResults = results.map((candidate) => ({
            id: candidate.id,
            name: candidate.name,
            voteCount: candidate.votes.length,
        }));
        res.status(200).json(formattedResults);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

// Get a student by ID
app.get('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await prisma.student.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, course, reg, password, campus } = req.body;
        const updatedStudent = await prisma.student.update({
            where: { id: parseInt(id, 10) },
            data: { name, course, reg, password, campus },
        });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.student.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});