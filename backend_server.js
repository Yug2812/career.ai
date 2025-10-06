// ===============================================
// BACKEND API SERVER (backend_server.js - Node.js/Express)
// This file implements the API endpoints the frontend calls.
// ===============================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); 

const app = express();
const PORT = 3000;
// Make sure this file exists and contains the mock user object
const DB_FILE = 'mock_db.json'; 

// --- CONFIGURATION ---
const API_URL_BASE = `/api`; 
// In a full deployment, you would uncomment this and call your Python Flask API
// const AI_SERVICE_URL = 'http://localhost:5000/api/ai'; 

// Middleware Setup
app.use(cors()); 
app.use(express.json()); 

// --- MOCK DATABASE UTILITIES ---

let db;

/**
 * Loads the mock database from file.
 */
function loadDatabase() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        db = JSON.parse(data);
        console.log("Database loaded successfully.");
    } catch (err) {
        console.error(`Error loading database file ${DB_FILE}:`, err.message);
        // Initialize with default structure if file fails to load
        db = { users: {} };
        // Ensure the 'test' user exists if starting fresh
        db.users['test@example.com'] = {
            "id": "ygtilt4zgxyarlmooyi0r",
            "name": "Test User",
            "email": "test@example.com",
            "password": "test",
            "quizResults": null,
            "profileDescription": "I am a new user testing the system.",
            "resumeFeedback": null
        };
        saveDatabase(); 
    }
}

/**
 * Saves the mock database back to file (for persistent mocking).
 */
function saveDatabase() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    } catch (err) {
        console.error("Error saving database file:", err.message);
    }
}

// Helper to find user by ID
function findUserById(userId) {
    for (const email in db.users) {
        if (db.users[email].id === userId) {
            return db.users[email];
        }
    }
    return null;
}

// ===============================================
// 1. AUTHENTICATION ROUTES
// ===============================================

app.post(`${API_URL_BASE}/auth/register`, (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    if (db.users[email]) {
        return res.status(409).json({ success: false, message: 'User already exists.' });
    }

    const newUser = {
        id: uuidv4(),
        name,
        email,
        password, 
        quizResults: null,
        profileDescription: `Hello, I am ${name} and I am looking for career guidance!`,
        resumeFeedback: null
    };

    db.users[email] = newUser;
    saveDatabase();

    res.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});


app.post(`${API_URL_BASE}/auth/login`, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Missing email or password.' });
    }

    const user = db.users[email];
    
    if (user && user.password === password) {
        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
});


// ===============================================
// 2. PROFILE ROUTES
// ===============================================

app.get(`${API_URL_BASE}/profile/data/:userId`, (req, res) => {
    const { userId } = req.params;
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ 
        success: true, 
        user: {
            name: user.name,
            email: user.email,
            profileDescription: user.profileDescription,
            quizResults: user.quizResults,
            resumeFeedback: user.resumeFeedback,
        }
    });
});

app.post(`${API_URL_BASE}/profile/update`, (req, res) => {
    const { userId, problemDescription } = req.body;
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.profileDescription = problemDescription;
    saveDatabase();

    res.json({ success: true, message: 'Profile updated successfully.' });
});


// ===============================================
// 3. AI/ML MOCK ROUTES 
// ===============================================

app.post(`${API_URL_BASE}/quiz/submit`, async (req, res) => {
    const { userId, answers } = req.body;
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // --- MOCK AI LOGIC ---
    let career = 'Full Stack Developer';
    if (answers.subject === 'math') {
        career = 'Data Scientist';
    } else if (answers.problem === 'creative') {
        career = 'UX/UI Designer';
    } else if (answers.motivation === 'impact') {
        career = 'AI Ethics Consultant';
    }

    const mockResults = {
        recommendations: [career, 'Cloud Engineer', 'Project Manager', 'Technical Writer'],
        skillReadiness: Math.floor(Math.random() * (90 - 45 + 1)) + 45, 
        targetCareer: career,
        rawAnswers: answers
    };

    user.quizResults = mockResults;
    saveDatabase();

    await new Promise(resolve => setTimeout(resolve, 1500)); 
    // --- END MOCK AI LOGIC ---

    res.json({ success: true, message: 'Quiz submitted and recommendations generated.', results: mockResults });
});

app.post(`${API_URL_BASE}/resume/analyze`, async (req, res) => {
    const { userId, fileName } = req.body; 
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // --- MOCK AI LOGIC ---
    const mockScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
    
    const mockFeedback = [
        { item: "Targeted Keywords Match", score: mockScore > 80 ? 'Excellent' : 'Good' },
        { item: "Formatting & Readability", score: 'Excellent' },
        { item: "Experience Depth", score: 'Needs work' },
        { item: "Action Verb Usage", score: 'Good' }
    ];

    const mockResults = {
        score: mockScore,
        feedback: mockFeedback
    };

    user.resumeFeedback = mockResults;
    saveDatabase();

    await new Promise(resolve => setTimeout(resolve, 1500)); 
    // --- END MOCK AI LOGIC ---
    
    res.json({ 
        success: true, 
        message: `Analysis complete for ${fileName}.`,
        ...mockResults 
    });
});

app.post(`${API_URL_BASE}/chatbot/query`, async (req, res) => {
    const { userId, query } = req.body;
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }
    
    // --- MOCK AI LOGIC ---
    let botResponse = `I see you asked about "${query}". As an AI Career Guide, I suggest researching online courses in ${user.quizResults?.targetCareer || 'Cloud Computing'} to stay competitive!`;
    
    if (query.toLowerCase().includes('salary')) {
        botResponse = "The salary for a Data Scientist can range from $80,000 to over $150,000 depending on location and experience. It's a growing field!";
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); 
    // --- END MOCK AI LOGIC ---

    res.json({ success: true, response: botResponse });
});

// ===============================================
// 4. SERVER START
// ===============================================

loadDatabase();

// NOTE: You may need to uncomment and adjust the line below 
// if you are running the backend and serving static files from the same server.
// app.use(express.static('public')); 

app.listen(PORT, () => {
    console.log(`🚀 Backend API Server running on http://localhost:${PORT}`);
});