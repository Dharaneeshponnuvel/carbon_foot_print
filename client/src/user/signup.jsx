import React, { useState } from 'react';
import '../style/login.css';

function Signup() {
    const [formData, setFormData] = useState({
        email: '', username: '', password: '', rePassword: '', address: '', sex: '', mobile: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.rePassword) {
            alert("Passwords don't match");
            return;
        }
        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        alert(data.message);
    };

    return (
         <div className="auth-page">
        <div className="wrapper">
            <form onSubmit={handleSignup}>
                <h2>Signup</h2>

                <div className="input-field">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    <label>Email</label>
                </div>

                <div className="input-field">
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    <label>Username</label>
                </div>

                <div className="input-field">
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    <label>Password</label>
                </div>

                <div className="input-field">
                    <input type="password" name="rePassword" value={formData.rePassword} onChange={handleChange} required />
                    <label>Re-enter Password</label>
                </div>

                <div className="input-field">
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                    <label>Address</label>
                </div>

                <div className="input-field">
                    <select name="sex" value={formData.sex} onChange={handleChange} required>
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="input-field">
                    <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
                    <label>Mobile Number</label>
                </div>

                <button type="submit">Signup</button>
                <div className="register">
                    <p>Already have an account? <a href="/">Login</a></p>
                </div>
            </form>
        </div>
        </div>
    );
}

export default Signup;
