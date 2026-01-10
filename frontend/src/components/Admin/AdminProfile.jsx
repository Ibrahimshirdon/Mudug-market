import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { API_URL } from '../../config';

const AdminProfile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [formData, setFormData] = useState({
        name: user.name || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.profilePicture || null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            // Use FormData for file upload
            const data = new FormData();
            data.append('name', formData.name);
            if (selectedFile) {
                data.append('profilePicture', selectedFile);
            }

            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    // 'Content-Type': 'multipart/form-data', // Do NOT set this manually with FormData, browser does it
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                localStorage.setItem('user', JSON.stringify(result.user));
                setUser(result.user);
                // Force a reload or update context to refresh sidebar image
                window.location.reload();
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: 'Password updated successfully!' });
                setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update password.' });
        }
    };

    return (
        <AdminLayout>
            <h2 style={{ marginBottom: '2rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>Admin Profile</h2>

            {message.text && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24'
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                {/* Profile Information */}
                <div>
                    <h3 style={{ marginBottom: '1.5rem', color: '#555' }}>Personal Information</h3>
                    <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Image Preview */}
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                margin: '0 auto',
                                border: '3px solid #eee',
                                background: '#f8f9fa'
                            }}>
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                        No Photo
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ width: '100%', padding: '0.5rem' }}
                            />
                        </div>

                        <button type="submit" className="cta-button" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
                    </form>
                </div>

                {/* Password Reset */}
                <div>
                    <h3 style={{ marginBottom: '1.5rem', color: '#555' }}>Security</h3>
                    <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={formData.confirmNewPassword}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <button type="submit" className="cta-button" style={{ alignSelf: 'flex-start', backgroundColor: '#6c757d' }}>Update Password</button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfile;
