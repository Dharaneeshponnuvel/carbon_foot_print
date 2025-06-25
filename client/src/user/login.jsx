import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login.css'; // Ensure this has proper styles

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            sessionStorage.setItem('user_id', data.user_id);
            navigate('/dashboard');
        } else {
            alert(data.error || 'Login failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="wrapper">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-field">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder=" "
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder=" "
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    <div className="forget">
                        <label>
                            <input type="checkbox" /> <p>Remember me</p>
                        </label>
                        <a href="#">Forgot password?</a>
                    </div>

                    <button type="submit">Log In</button>

                    <div className="register">
                        Don't have an account? <a href="/signup">Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
