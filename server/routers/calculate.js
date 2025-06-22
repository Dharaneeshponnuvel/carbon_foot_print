const express = require('express');
const { Client } = require('pg');
const router = express.Router();
const axios = require('axios');

// DB Config
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'foot_print',
    password: process.env.DB_PASSWORD || 'Dharaneesh@20',
    port: process.env.DB_PORT || 5432,
};

router.post('/ai', async (req, res) => {
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized: user not logged in' });
    }

    const formData = req.body;

    try {
        // 1. Get result from Flask
        const response = await axios.post('http://127.0.0.1:5000/calculate/ai', formData);
        const ai_result = response.data.ai_result;

        // 2. Save all data + result to PostgreSQL
        const client = new Client(dbConfig);
        await client.connect();

        await client.query(
            `INSERT INTO carbon_emission_data (
                user_id, body_type, sex, diet, how_often_shower, heating_energy_source,
                transport, vehicle_type, social_activity, monthly_grocery_bill,
                frequency_of_traveling_by_air, vehicle_monthly_distance_km,
                waste_bag_size, waste_bag_weekly_count, how_long_tv_pc_daily_hour,
                how_many_new_clothes_monthly, how_long_internet_daily_hour,
                energy_efficiency, recycling, cooking_with, carbon_emitted
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18,
                $19, $20, $21
            )`,
            [
                user_id,
                formData.body_type,
                formData.sex,
                formData.diet,
                formData.how_often_shower,
                formData.heating_energy_source,
                formData.transport,
                formData.vehicle_type,
                formData.social_activity,
                formData.monthly_grocery_bill,
                formData.frequency_of_traveling_by_air,
                formData.vehicle_monthly_distance_km,
                formData.waste_bag_size,
                formData.waste_bag_weekly_count,
                formData.how_long_tv_pc_daily_hour,
                formData.how_many_new_clothes_monthly,
                formData.how_long_internet_daily_hour,
                formData.energy_efficiency,
                formData.recycling,
                formData.cooking_with,
                ai_result
            ]
        );

        await client.end();

        res.status(200).json({ ai_result });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to calculate and save result' });
    }
});
router.post('/recommend', async (req, res) => {
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized: user not logged in' });
    }

    const formData = req.body;

    try {
        // Call Python Flask recommender endpoint
        const response = await axios.post('http://127.0.0.1:5000/calculate/recommend', formData);

        const recommendationData = response.data;

        // Return top, least activities + chart_data to frontend
        res.status(200).json({
            top_activities: recommendationData["Top 2 Carbon-Intensive Activities"],
            least_activities: recommendationData["Least Emitting Activities"],
            chart_data: recommendationData["Chart Data"]
        });

    } catch (error) {
        console.error('Recommendation Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            stack: error.stack
        });
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

// ✅ Required to export this router
module.exports = router;
