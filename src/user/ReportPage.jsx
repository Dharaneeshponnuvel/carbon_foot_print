import React, { useEffect, useState } from 'react';

function ReportPage() {
    const [data, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchReport = async (date = '') => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:5000/report/r${date ? `?date=${date}` : ''}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch report');
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error fetching report data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleDateChange = (e) => {
        const value = e.target.value;
        setSelectedDate(value);
        fetchReport(value);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Carbon Emission Report</h2>

            <label htmlFor="dateFilter">Filter by Date: </label>
            <input
                type="date"
                id="dateFilter"
                value={selectedDate}
                onChange={handleDateChange}
                style={{ marginBottom: '1rem', marginLeft: '0.5rem' }}
            />

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && data.length === 0 && <p>No data available.</p>}

            {!loading && data.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            <th style={th}>Date</th>
                            <th style={th}>Body Type</th>
                            <th style={th}>Sex</th>
                            <th style={th}>Diet</th>
                            <th style={th}>Shower Frequency</th>
                            <th style={th}>Heating Source</th>
                            <th style={th}>Transport</th>
                            <th style={th}>Vehicle Type</th>
                            <th style={th}>Social Activity</th>
                            <th style={th}>Grocery Bill</th>
                            <th style={th}>Air Travel</th>
                            <th style={th}>Vehicle Distance</th>
                            <th style={th}>Waste Bag Size</th>
                            <th style={th}>Waste Bag Count</th>
                            <th style={th}>TV/PC Hours</th>
                            <th style={th}>New Clothes</th>
                            <th style={th}>Internet Hours</th>
                            <th style={th}>Energy Efficiency</th>
                            <th style={th}>Recycling</th>
                            <th style={th}>Cooking With</th>
                            <th style={th}>Carbon Emitted</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((entry, index) => (
                            <tr key={index}>
                                <td>{new Date(entry.date).toISOString().split('T')[0]}</td>

                                <td style={td}>{entry.body_type}</td>
                                <td style={td}>{entry.sex}</td>
                                <td style={td}>{entry.diet}</td>
                                <td style={td}>{entry.how_often_shower}</td>
                                <td style={td}>{entry.heating_energy_source}</td>
                                <td style={td}>{entry.transport}</td>
                                <td style={td}>{entry.vehicle_type}</td>
                                <td style={td}>{entry.social_activity}</td>
                                <td style={td}>{entry.monthly_grocery_bill}</td>
                                <td style={td}>{entry.frequency_of_traveling_by_air}</td>
                                <td style={td}>{entry.vehicle_monthly_distance_km}</td>
                                <td style={td}>{entry.waste_bag_size}</td>
                                <td style={td}>{entry.waste_bag_weekly_count}</td>
                                <td style={td}>{entry.how_long_tv_pc_daily_hour}</td>
                                <td style={td}>{entry.how_many_new_clothes_monthly}</td>
                                <td style={td}>{entry.how_long_internet_daily_hour}</td>
                                <td style={td}>{entry.energy_efficiency}</td>
                                <td style={td}>{entry.recycling}</td>
                                <td style={td}>{entry.cooking_with}</td>
                                <td style={td}>{entry.carbon_emitted}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const th = {
    border: '1px solid #ccc',
    padding: '8px',
    backgroundColor: '#f8f8f8',
    textAlign: 'left',
    whiteSpace: 'nowrap',
};

const td = {
    border: '1px solid #ccc',
    padding: '8px',
    whiteSpace: 'nowrap',
};

export default ReportPage;
