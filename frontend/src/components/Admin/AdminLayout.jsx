import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/profile', icon: '👤', label: 'My Profile' },
        { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f9' }}>
            {/* Sidebar */}
            <div style={{
                width: '250px',
                background: '#2c3e50',
                color: 'white',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#fff',
                        margin: '0 auto 1rem',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '2rem', color: '#2c3e50' }}>{user.name ? user.name.charAt(0).toUpperCase() : 'A'}</span>
                        )}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{user.name || 'Admin'}</h3>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Administrator</span>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {navItems.map((item) => (
                            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                <Link to={item.path} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.8rem 1rem',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    background: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    transition: 'background 0.3s'
                                }}>
                                    <span style={{ marginRight: '10px' }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <button onClick={handleLogout} style={{
                    marginTop: 'auto',
                    padding: '0.8rem',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                    <span>🚪</span> Logout
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '2rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    minHeight: '80vh' // Ensure content area has some height
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
