const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const nodemailer = require('nodemailer');
require('dotenv').config();

// In-memory OTP store
const otpStore = new Map();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// PostgreSQL client
function createClient() {
    return new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
}

// GET /profile/p - fetch profile
router.get('/p', async (req, res) => {
    const userId = req.session.user_id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const client = createClient();
    try {
        await client.connect();
        const query = `
            SELECT user_id, email, username, address, sex, mobile
            FROM users
            WHERE user_id = $1
        `;
        const result = await client.query(query, [userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    } finally {
        await client.end();
    }
});

// POST /profile/request-otp - send OTP to user's existing email
router.post('/request-otp', async (req, res) => {
    const userId = req.session.user_id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const client = createClient();
    try {
        await client.connect();
        // Get the user's current email
        const query = `SELECT email FROM users WHERE user_id = $1`;
        const result = await client.query(query, [userId]);

        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        const userEmail = result.rows[0].email;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
        });

        otpStore.set(userId, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
        });

        res.json({ message: 'OTP sent to your registered email' });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    } finally {
        await client.end();
    }
});

// POST /profile/verify-otp - verify OTP & update profile (address, sex, mobile)
router.post('/verify-otp', async (req, res) => {
    const userId = req.session.user_id;
    const { otp, address, sex, mobile } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!otp) return res.status(400).json({ error: 'OTP required' });

    const otpData = otpStore.get(userId);
    if (!otpData) return res.status(400).json({ error: 'No OTP requested or expired' });
    if (Date.now() > otpData.expiresAt) {
        otpStore.delete(userId);
        return res.status(400).json({ error: 'OTP expired' });
    }
    if (otp !== otpData.otp) return res.status(400).json({ error: 'Invalid OTP' });

    const client = createClient();
    try {
        await client.connect();
        const query = `
            UPDATE users SET
                             address = $1,
                             sex = $2,
                             mobile = $3
            WHERE user_id = $4
                RETURNING user_id, email, username, address, sex, mobile
        `;
        const result = await client.query(query, [address, sex, mobile, userId]);

        otpStore.delete(userId);
        res.json({ message: 'Profile updated successfully', profile: result.rows[0] });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    } finally {
        await client.end();
    }
});

module.exports = router;
