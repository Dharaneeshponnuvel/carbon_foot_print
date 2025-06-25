import React, { useEffect, useState } from 'react';
import LineChartComponent from '../user/LineChartComponent';
import '../style/dashboard.css';
import Logout from '../user/logout';

function Dashboard() {
    const [carbonTotal, setCarbonTotal] = useState(0);
    const [dailyData, setDailyData] = useState([]);
    const [recentRecords, setRecentRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `http://localhost:5000/dashboard/d`,
                    { credentials: 'include' }
                );

                if (!res.ok) {
                    throw new Error(`Server error: ${res.status}`);
                }

                const data = await res.json();

                setCarbonTotal(data.totalCarbon);
                setDailyData(data.dailyData);
                setRecentRecords(data.recentRecords);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <a href="/dashboard">Home</a>
                <a href="/calculate">Calculate Carbon Use</a>
                <a href="/report">Report</a>
                <a href="/about">About Us</a>
                <a href="/profile">Profile</a>
                <Logout onLogout={() => window.location.href = '/'} />
            </nav>

            <div className="filters">
                <div className="total-box">
                    <h3>Total Carbon Used</h3>
                    {loading ? <p>Loading...</p> : <p>{carbonTotal} kg CO₂</p>}
                    {error && <p className="error">{error}</p>}
                </div>
            </div>

            <div className="chart-section">
                <h4>Carbon Usage Per Day</h4>
                {loading ? (
                    <p>Loading chart...</p>
                ) : (
                    <LineChartComponent
                        data={dailyData.map((item) => ({
                            ...item,
                            date: new Date(item.date).toISOString().split('T')[0],
                            total: Number(item.total),
                        }))}
                    />
                )}
            </div>

            <div className="recent-section">
                <h4>Last 5 Days of Carbon Usage</h4>
                {loading ? (
                    <p>Loading records...</p>
                ) : recentRecords.length === 0 ? (
                    <p>No recent records found.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Carbon Emitted</th>
                            <th>Transport</th>
                            <th>Diet</th>
                            <th>Shower</th>
                            <th>Energy</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentRecords.map((rec, idx) => (
                            <tr key={idx}>
                                <td>{new Date(rec.date).toISOString().split('T')[0]}</td>

                                <td>{rec.carbon_emitted} kg</td>
                                <td>{rec.transport}</td>
                                <td>{rec.diet}</td>
                                <td>{rec.how_often_shower}</td>
                                <td>{rec.heating_energy_source}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
