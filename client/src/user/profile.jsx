import React, { useState, useEffect } from 'react';
import '../style/Profile.css';
function EditProfile() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ address: '', sex: '', mobile: '' });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/profile/p', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                setForm({
                    address: data.address || '',
                    sex: data.sex || '',
                    mobile: data.mobile || '',
                });
            })
            .catch(() => setMessage('Failed to load profile'));
    }, []);

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Send OTP to the user's existing email stored in profile
    const sendOtp = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('http://localhost:5000/profile/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                // No new email, OTP always to current email. Only send mobile number in body to store later.
                body: JSON.stringify({ newMobileNumber: form.mobile }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
            setOtpSent(true);
            setMessage('OTP sent to your email! Please check.');
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtpAndSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('http://localhost:5000/profile/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    otp,
                    address: form.address,
                    sex: form.sex,
                    mobile: form.mobile// Mobile number is sent here and will be updated if OTP verified
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to verify OTP');
            setProfile(data.profile);
            setOtpSent(false);
            setOtp('');
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>

            <div>
                <label>User ID: </label>
                <input value={profile.user_id} readOnly disabled />
            </div>
            <div>
                <label>Username: </label>
                <input value={profile.username} readOnly disabled />
            </div>
            <div>
                <label>Email (OTP sent here): </label>
                <input value={profile.email} readOnly disabled />
            </div>

            {/* Editable fields */}
            <div>
                <label>Address: </label>
                <input name="address" value={form.address} onChange={handleChange} />
            </div>
            <div>
                <label>Sex: </label>
                <select name="sex" value={form.sex} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label>Mobile Number: </label>
                <input name="mobile" value={form.mobile} onChange={handleChange} />
            </div>

            {!otpSent ? (
                <button onClick={sendOtp} disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send OTP to Email'}
                </button>
            ) : (
                <>
                    <div>
                        <label>Enter OTP: </label>
                        <input value={otp} onChange={e => setOtp(e.target.value)} />
                    </div>
                    <button onClick={verifyOtpAndSave} disabled={loading || !otp}>
                        {loading ? 'Verifying...' : 'Verify OTP & Save'}
                    </button>
                </>
            )}

            {message && <p>{message}</p>}
        </div>
    );
}

export default EditProfile;
