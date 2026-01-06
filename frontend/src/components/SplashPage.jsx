import React from 'react';

const SplashPage = () => {
    return (
        <div className="splash-container">
            <div className="logo-container">
                <img src="/logo.png" alt="Mudug Market Logo" />
            </div>
            <h1 className="headline">Welcome to Mudug Market</h1>
            <p className="subheadline">
                The premier digital marketplace for quality products and regional business hub in Mudug.
            </p>
            <button className="cta-button" onClick={() => console.log('Proceeding...')}>
                Explore Marketplace
            </button>
        </div>
    );
};

export default SplashPage;
