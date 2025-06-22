const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const router = express.Router();

router.get('/d', async (req, res) => {
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }

    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();

        const totalQuery = `
            SELECT SUM(carbon_emitted) AS total FROM carbon_emission_data
            WHERE user_id = $1
        `;
        const dailyQuery = `
            SELECT date, SUM(carbon_emitted) AS total FROM carbon_emission_data
            WHERE user_id = $1
            GROUP BY date ORDER BY date ASC
        `;
        const recentQuery = `
           SELECT CAST(date AS DATE) AS date, SUM(carbon_emitted) AS total
FROM carbon_emission_data
WHERE user_id = $1
GROUP BY CAST(date AS DATE)
ORDER BY CAST(date AS DATE) ASC;
        `;

        const params = [user_id];
        const totalResult = await client.query(totalQuery, params);
        const dailyResult = await client.query(dailyQuery, params);
        const recentResult = await client.query(recentQuery, params);

        res.json({
            totalCarbon: totalResult.rows[0].total || 0,
            dailyData: dailyResult.rows,
            recentRecords: recentResult.rows
        });

    } catch (err) {
        console.error('Dashboard fetch error:', err);
        res.status(500).json({ error: 'Server error fetching dashboard data' });
    } finally {
        await client.end();
    }
});
module.exports = router;
