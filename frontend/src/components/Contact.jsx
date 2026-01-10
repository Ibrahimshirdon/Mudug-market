import React from 'react';

const Contact = () => {
    return (
        <div className="splash-container">
            <div className="glass-panel" style={{
                background: 'var(--glass-bg)',
                padding: '3rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                maxWidth: '800px',
                width: '90%',
                textAlign: 'center'
            }}>
                <h1 className="headline" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>Contact Us</h1>
                <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
                        <strong>Email:</strong> ibra090shirdon@gmail.com
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
                        <strong>Phone:</strong> +252 666251592
                    </p>
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
                    />
                    <textarea
                        placeholder="Your Message"
                        rows="5"
                        style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', resize: 'none' }}
                    ></textarea>
                    <button type="submit" className="cta-button">Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
