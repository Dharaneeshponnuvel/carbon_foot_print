import React from 'react';
import '../style/about.css'; // Create this CSS file for styling

function About() {
    return (
        <div className="about-container">
            <h1>About This Project</h1>
            <p>
                The <strong>Carbon Footprint Calculator</strong> is a web application designed to help users
                measure, monitor, and reduce their carbon emissions based on daily lifestyle activities.
            </p>

            <h2>Why This Project?</h2>
            <p>
                Climate change is one of the most urgent challenges facing our planet. Individual
                actions play a vital role in reducing greenhouse gas emissions. This tool empowers
                users to:
            </p>
            <ul>
                <li>Understand how their habits contribute to carbon emissions</li>
                <li>Track emissions from transport, energy, diet, and waste</li>
                <li>Receive AI-powered recommendations to reduce their footprint</li>
            </ul>

            <h2>Core Features</h2>
            <ul>
                <li>User-friendly carbon usage calculator</li>
                <li>Interactive charts and dashboards</li>
                <li>AI-based activity insights and suggestions</li>
                <li>Profile management and secure authentication</li>
            </ul>

            <h2>Who Is It For?</h2>
            <p>
                This tool is built for individuals, students, and environmentally conscious citizens
                who want to take responsibility for their ecological impact and make data-driven decisions
                to live sustainably.
            </p>
        </div>
    );
}

export default About;
