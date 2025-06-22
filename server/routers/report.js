const express = require('express');
const router = express.Router();
const { Client } = require('pg');
require('dotenv').config();

// Function to create a new client connection (non-pooled)
function createClient() {
    return new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
}

// GET all carbon data for logged-in user (optionally filter by date)
router.get('/r', async (req, res) => {
    const userId = req.session.user_id;
    const { date } = req.query;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const client = createClient();

    try {
        await client.connect();

        let query = 'SELECT * FROM carbon_emission_data WHERE user_id = $1';
        let params = [userId];

        if (date) {
            query += ' AND date = $2';
            params.push(date);
        }

        const result = await client.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({ error: 'Failed to fetch report data' });
    } finally {
        await client.end();
    }
});

module.exports = router;
