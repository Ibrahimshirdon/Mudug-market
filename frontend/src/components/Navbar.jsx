import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Mudug Market</Link>
            </div>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '2rem' }}>
                <li><Link to="/" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: '500' }}>Home</Link></li>
                <li><Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: '500' }}>About</Link></li>
                <li><Link to="/contact" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: '500' }}>Contact</Link></li>
                <li><Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: '500' }}>Login</Link></li>
                <li>
                    <Link to="/register" style={{
                        textDecoration: 'none',
                        color: 'white',
                        background: 'var(--secondary-color)',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '25px'
                    }}>
                        Get Started
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
