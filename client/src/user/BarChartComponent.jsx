import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function BarChartComponent({ data }) {
    return (
        <BarChart width={600} height={400} data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => `${value} kg CO₂`} />
            <Bar dataKey="value" fill="#4CAF50" />
        </BarChart>
    );
}

export default BarChartComponent;
