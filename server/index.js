const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
require('dotenv').config();
const calculateRoute = require('./routers/calculate');
const dashboardRoute= require('./routers/dashboard');
const reportRoute = require('./routers/report');
const profileRoute = require('./routers/profile');


const app = express();
const port = 5000;

// PostgreSQL pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // your frontend origin
    credentials: true
}));
app.use(express.json());
app.use(session({
    store: new pgSession({
        pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }
}));

// Generate user_id
function generateUserId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Signup route
app.post('/signup', async (req, res) => {
    const { email, username, password, address, sex, mobile } = req.body;
    const user_id = generateUserId();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            `INSERT INTO users (user_id, email, username, password, address, sex, mobile)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [user_id, email, username, hashedPassword, address, sex, mobile]
        );

        res.json({ message: 'User registered successfully', user_id });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

        req.session.user_id = user.user_id;  // ✅ Save in session
        res.json({ message: 'Login successful', user_id: user.user_id });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});


// Protected route example

app.use('/calculate', calculateRoute);
app.use('/dashboard', dashboardRoute);
app.use('/report', reportRoute);
app.use('/profile', profileRoute);

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // default session cookie name
        res.json({ message: 'Logged out' });
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = { pool };
