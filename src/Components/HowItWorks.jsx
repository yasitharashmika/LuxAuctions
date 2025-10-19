// src/components/HowItWorks.js

import React from 'react';
import '../Style/HowItWorks.css'; // Import the CSS file

// SVG Icons for each step
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const GavelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655 9.75 21.75l-2.47-2.47m5.13-3.625L16.5 21.75l2.47-2.47m-5.13-3.625-1.39-1.39a1.125 1.125 0 0 1 0-1.59l2.47-2.47a1.125 1.125 0 0 1 1.59 0l1.39 1.39m-5.13 3.625L3 6.345m8.412 9.31a1.125 1.125 0 0 0 0-1.59l-2.47-2.47a1.125 1.125 0 0 0-1.59 0L6.345 3m8.412 9.31 4.56-4.56a1.125 1.125 0 0 0 0-1.59l-2.47-2.47a1.125 1.125 0 0 0-1.59 0l-4.56 4.56m8.412 9.31-4.56-4.56" />
    </svg>
);

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1 1 9 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 16.5c-1.437 1.437-3.375 2.25-5.375 2.25s-3.938-.813-5.375-2.25M12 14.25v-3.75m-3.75 3.75h7.5" />
    </svg>
);


const HowItWorks = () => {
    return (
        <section className="how-it-works">
            <h2 className="how-it-works-title">
                HOW IT <span className="highlight">WORKS</span>
            </h2>
            <p className="how-it-works-description">
                Simple steps to participate in our exclusive jewelry auctions
            </p>

            <div className="steps-grid">
                <div className="step-card">
                    <div className="step-icon-wrapper">
                        <SearchIcon />
                    </div>
                    <h3 className="step-title">BROWSE & DISCOVER</h3>
                    <p className="step-description">
                        Explore our curated collection of fine jewelry from verified sellers and estates.
                    </p>
                </div>

                <div className="step-card">
                    <div className="step-icon-wrapper">
                        <GavelIcon />
                    </div>
                    <h3 className="step-title">PLACE YOUR BID</h3>
                    <p className="step-description">
                        Register and place competitive bids on items that catch your eye.
                    </p>
                </div>

                <div className="step-card">
                    <div className="step-icon-wrapper">
                        <TrophyIcon />
                    </div>
                    <h3 className="step-title">WIN & COLLECT</h3>
                    <p className="step-description">
                        Secure your winning bid and receive your authenticated jewelry piece.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;