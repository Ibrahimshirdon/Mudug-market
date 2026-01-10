import React, { useState } from 'react';
import { API_URL } from '../../config';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = '/login';
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
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
                <h1 className="headline" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '2rem' }}>Register</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
                    />
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
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
                    />
                    <button type="submit" className="cta-button" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
                </form>
                <p style={{ marginTop: '1rem', color: 'var(--text-color)' }}>
                    Already have an account? <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
