import React, { useState } from 'react';
import BarChartComponent from '../user/BarChartComponent';
import '../style/calculate.css';
const initialFormState = {
    body_type: '',
    sex: '',
    diet: '',
    how_often_shower: '',
    heating_energy_source: '',
    transport: '',
    vehicle_type: '',
    social_activity: '',
    monthly_grocery_bill: '',
    frequency_of_traveling_by_air: '',
    vehicle_monthly_distance_km: '',
    waste_bag_size: '',
    waste_bag_weekly_count: '',
    how_long_tv_pc_daily_hour: '',
    how_many_new_clothes_monthly: '',
    how_long_internet_daily_hour: '',
    energy_efficiency: '',
    recycling: '',
    cooking_with: '',
};

function CalculateCarbon() {
    const [formData, setFormData] = useState(initialFormState);
    const [message, setMessage] = useState('');
    const [aiResult, setAiResult] = useState(null); // ✅ Added
    const [recommendations, setRecommendations] = useState(null);
    const [chartData, setChartData] = useState([]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Calculating...');
        setRecommendations(null);
        setChartData([]);
        setAiResult(null); // Reset

        try {
            // Step 1: Get AI result
            const aiRes = await fetch('http://localhost:5000/calculate/ai', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const aiData = await aiRes.json();
            if (!aiRes.ok) throw new Error(aiData.error || 'AI calculation failed');
            setAiResult(aiData.ai_result); // ✅ Save result

            // Step 2: Get recommendation
            const recRes = await fetch('http://localhost:5000/calculate/recommend', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const recData = await recRes.json();
            if (!recRes.ok) throw new Error(recData.error || 'Recommendation failed');

            setRecommendations(recData);
            setChartData(recData.chart_data || []);
            setMessage('Calculation complete. See below for results.');
            setFormData(initialFormState);
        } catch (err) {
            console.error(err);
            setMessage(`Error: ${err.message}`);
        }
    };

    return (
        <div className="form-container">
            <h2>Calculate Your Carbon Usage</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(initialFormState).map((field) => (
                    <div key={field} className="form-group">
                        <label htmlFor={field}>{field.replace(/_/g, ' ')}</label>
                        <input
                            id={field}
                            type="text"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

                <button type="submit">Submit</button>
                <p>{message}</p>
            </form>

            {/* ✅ Show AI Result */}
            {aiResult !== null && (
                <div className="ai-result">
                    <h3>Total Carbon Emitted</h3>
                    <p><strong>{aiResult.toFixed(2)} kg CO₂e</strong></p>
                </div>
            )}

            {recommendations && (
                <div className="results-section">
                    <h3>Top 2 Carbon-Intensive Activities</h3>
                    <ul>
                        {recommendations.top_activities?.map((item, idx) => (
                            <li key={idx}>
                                <strong>{item.Activity}:</strong> {item['Message']}
                                ({item['Emission (kg CO₂e)']} kg, {item.Severity})
                            </li>
                        ))}
                    </ul>

                    <h3>Least Emitting Activities</h3>
                    <ul>
                        {recommendations.least_activities?.map((item, idx) => (
                            <li key={idx}>
                                <strong>{item.Activity}:</strong> {item['Message']}
                                ({item['Emission (kg CO₂e)']} kg, {item.Severity})
                            </li>
                        ))}
                    </ul>

                    <h3>Carbon Emission per Activity</h3>
                    <BarChartComponent data={chartData} />
                </div>
            )}
        </div>
    );
}

export default CalculateCarbon;
