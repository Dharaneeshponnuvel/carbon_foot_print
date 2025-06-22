import React from 'react';

function LogoutButton({ onLogout }) {
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                credentials: 'include', // must include to access session cookie
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                onLogout(); // callback to update React state or redirect
            } else {
                alert(data.error || 'Logout failed');
            }
        } catch (err) {
            console.error('Logout error:', err);
            alert('Network error during logout');
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
