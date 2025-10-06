// ===============================================
// BACKEND API SERVER (backend_server.js - Node.js/Express)
// This file implements the API endpoints the frontend calls.
// ===============================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// Make sure this file exists and contains the mock user object
const DB_FILE = 'mock_db.json';
const MONGO_URI = process.env.MONGO_URI || null;

// --- CONFIGURATION ---
const API_URL_BASE = `/api`;
// External AI service (Flask) base URL; e.g., http://localhost:5000/api
const AI_SERVICE_BASE = process.env.AI_SERVICE_BASE || null;

// Middleware Setup
app.use(cors()); 
app.use(express.json()); 

// --- DATABASE LAYER (MongoDB with Mock Fallback) ---

let db; // for mock JSON fallback only
let isMongoReady = false;

// Define Mongoose schema/model
const userSchema = new mongoose.Schema({
    id: { type: String, index: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quizResults: { type: mongoose.Schema.Types.Mixed, default: null },
    profileDescription: { type: String, default: '' },
    resumeFeedback: { type: mongoose.Schema.Types.Mixed, default: null }
}, { timestamps: true });

let UserModel;

async function connectMongo() {
    if (!MONGO_URI) return;
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        UserModel = mongoose.model('User', userSchema);
        isMongoReady = true;
        console.log('Connected to MongoDB.');
    } catch (err) {
        isMongoReady = false;
        console.error('Failed to connect to MongoDB, falling back to mock JSON DB:', err.message);
    }
}

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

// Helper to find user by ID (supports Mongo or mock)
async function findUserById(userId) {
    if (isMongoReady && UserModel) {
        return await UserModel.findOne({ id: userId }).lean();
    }
    for (const email in db.users) {
        if (db.users[email].id === userId) {
            return db.users[email];
        }
    }
    return null;
}

async function findUserByEmail(email) {
    if (isMongoReady && UserModel) {
        return await UserModel.findOne({ email }).lean();
    }
    return db.users[email] || null;
}

async function createUser({ name, email, password }) {
    const newUser = {
        id: uuidv4(),
        name,
        email,
        password,
        quizResults: null,
        profileDescription: `Hello, I am ${name} and I am looking for career guidance!`,
        resumeFeedback: null
    };
    if (isMongoReady && UserModel) {
        const doc = new UserModel(newUser);
        await doc.save();
        return { ...newUser };
    }
    db.users[email] = newUser;
    saveDatabase();
    return newUser;
}

async function updateUserById(userId, update) {
    if (isMongoReady && UserModel) {
        await UserModel.updateOne({ id: userId }, { $set: update });
        return await UserModel.findOne({ id: userId }).lean();
    }
    const user = await findUserById(userId);
    if (!user) return null;
    Object.assign(user, update);
    saveDatabase();
    return user;
}

// ===============================================
// 1. AUTHENTICATION ROUTES
// ===============================================

app.post(`${API_URL_BASE}/auth/register`, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        const existing = await findUserByEmail(email);
        if (existing) {
            return res.status(409).json({ success: false, message: 'User already exists.' });
        }

        const newUser = await createUser({ name, email, password });
        res.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});


app.post(`${API_URL_BASE}/auth/login`, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Missing email or password.' });
        }
        const user = await findUserByEmail(email);
        if (user && user.password === password) {
            return res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
        }
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});


// ===============================================
// 2. PROFILE ROUTES
// ===============================================

app.get(`${API_URL_BASE}/profile/data/:userId`, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await findUserById(userId);
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
    } catch (err) {
        console.error('Profile fetch error:', err.message);
        res.status(500).json({ success: false, message: 'Server error fetching profile.' });
    }
});

app.post(`${API_URL_BASE}/profile/update`, async (req, res) => {
    try {
        const { userId, problemDescription } = req.body;
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        await updateUserById(userId, { profileDescription: problemDescription });
        res.json({ success: true, message: 'Profile updated successfully.' });
    } catch (err) {
        console.error('Profile update error:', err.message);
        res.status(500).json({ success: false, message: 'Server error updating profile.' });
    }
});


// ===============================================
// 3. AI/ML MOCK ROUTES 
// ===============================================

app.post(`${API_URL_BASE}/quiz/submit`, async (req, res) => {
    try {
        const { userId, answers } = req.body;
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Try external AI service if configured
        if (AI_SERVICE_BASE) {
            try {
                const { data } = await axios.post(`${AI_SERVICE_BASE}/quiz/submit`, { userId, answers }, { timeout: 8000 });
                if (data && data.success && data.results) {
                    await updateUserById(userId, { quizResults: data.results });
                    return res.json({ success: true, message: data.message || 'Quiz processed.', results: data.results });
                }
            } catch (err) {
                console.warn('AI service (quiz) failed, using mock:', err.message);
            }
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

        await updateUserById(userId, { quizResults: mockResults });
        await new Promise(resolve => setTimeout(resolve, 1500));
        // --- END MOCK AI LOGIC ---

        res.json({ success: true, message: 'Quiz submitted and recommendations generated.', results: mockResults });
    } catch (err) {
        console.error('Quiz submit error:', err.message);
        res.status(500).json({ success: false, message: 'Server error submitting quiz.' });
    }
});

app.post(`${API_URL_BASE}/resume/analyze`, async (req, res) => {
    try {
        const { userId, fileName } = req.body;
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (AI_SERVICE_BASE) {
            try {
                const { data } = await axios.post(`${AI_SERVICE_BASE}/resume/analyze`, { userId, fileName }, { timeout: 10000 });
                if (data && data.success && typeof data.score !== 'undefined' && data.feedback) {
                    await updateUserById(userId, { resumeFeedback: { score: data.score, feedback: data.feedback } });
                    return res.json({ success: true, message: data.message || `Analysis complete for ${fileName}.`, score: data.score, feedback: data.feedback });
                }
            } catch (err) {
                console.warn('AI service (resume) failed, using mock:', err.message);
            }
        }

        // --- MOCK AI LOGIC ---
        const mockScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
        const mockFeedback = [
            { item: "Targeted Keywords Match", score: mockScore > 80 ? 'Excellent' : 'Good' },
            { item: "Formatting & Readability", score: 'Excellent' },
            { item: "Experience Depth", score: 'Needs work' },
            { item: "Action Verb Usage", score: 'Good' }
        ];
        const mockResults = { score: mockScore, feedback: mockFeedback };
        await updateUserById(userId, { resumeFeedback: mockResults });
        await new Promise(resolve => setTimeout(resolve, 1500));
        // --- END MOCK AI LOGIC ---

        res.json({ success: true, message: `Analysis complete for ${fileName}.`, ...mockResults });
    } catch (err) {
        console.error('Resume analyze error:', err.message);
        res.status(500).json({ success: false, message: 'Server error analyzing resume.' });
    }
});

app.post(`${API_URL_BASE}/chatbot/query`, async (req, res) => {
    try {
        const { userId, query } = req.body;
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (AI_SERVICE_BASE) {
            try {
                const { data } = await axios.post(`${AI_SERVICE_BASE}/chatbot/query`, { userId, query }, { timeout: 10000 });
                if (data && data.success && data.response) {
                    return res.json({ success: true, response: data.response });
                }
            } catch (err) {
                console.warn('AI service (chatbot) failed, using mock:', err.message);
            }
        }

        // --- MOCK AI LOGIC ---
        let botResponse = `I see you asked about "${query}". As an AI Career Guide, I suggest researching online courses in ${user.quizResults?.targetCareer || 'Cloud Computing'} to stay competitive!`;
        if (query.toLowerCase().includes('salary')) {
            botResponse = "The salary for a Data Scientist can range from $80,000 to over $150,000 depending on location and experience. It's a growing field!";
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        // --- END MOCK AI LOGIC ---
        res.json({ success: true, response: botResponse });
    } catch (err) {
        console.error('Chatbot error:', err.message);
        res.status(500).json({ success: false, message: 'Server error processing chatbot query.' });
    }
});

// ===============================================
// 4. SERVER START
// ===============================================

// Initialize database layer
connectMongo().then(() => {
    if (!isMongoReady) {
loadDatabase();
    }
});

// Serve frontend static files so http://localhost:3000 loads the UI
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Backend API Server running on http://localhost:${PORT}`);
});