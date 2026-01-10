import React from 'react';

const About = () => {
    return (
        <div className="splash-container">
            <div className="glass-panel" style={{
                background: 'var(--glass-bg)',
                padding: '3rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                maxWidth: '800px',
                width: '90%',
                textAlign: 'left'
            }}>
                <h1 className="headline" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>About Mudug Market</h1>
                <p className="subheadline" style={{ color: 'var(--text-color)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Mudug Market is the premier digital marketplace designed to connect businesses and consumers in the Mudug region.
                    Our mission is to empower local commerce by providing a seamless, secure, and modern platform for buying and selling quality products.
                    We strive to become the central business hub that drives economic growth and digital transformation in the community.
                </p>
            </div>
        </div>
    );
};

export default About;
