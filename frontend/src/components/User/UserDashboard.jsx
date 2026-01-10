import React, { useEffect, useState } from 'react';

const UserDashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading user data...</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Welcome, {user.name}</h1>
            <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '15px',
                padding: '2rem'
            }}>
                <h2>User Dashboard</h2>
                <p>This is your personal dashboard. Here you will be able to manage your profile and orders.</p>

                <div style={{ marginTop: '2rem' }}>
                    <h3>Your Details</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
