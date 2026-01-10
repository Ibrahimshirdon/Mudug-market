import React, { useState } from 'react';
import { API_URL } from '../../config';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert(`Debug: Attempting login to: ${API_URL}/auth/login`);
        console.log('Attemping login to:', `${API_URL}/auth/login`);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user)); // Optional: store user info
                alert('Login successful!');
                if (data.user.role === 'admin') {
                    window.location.href = '/admin/dashboard';
                } else {
                    window.location.href = '/user/dashboard';
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="splash-container">
            <div className="glass-panel" style={{
                background: 'var(--glass-bg)',
                padding: '3rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center'
            }}>
                <h1 className="headline" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '2rem' }}>Login</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
                    />
                    <button type="submit" className="cta-button" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
                </form>
                <p style={{ marginTop: '1rem', color: 'var(--text-color)' }}>
                    Don't have an account? <a href="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
