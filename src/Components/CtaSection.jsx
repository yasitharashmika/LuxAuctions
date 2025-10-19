// src/components/CtaSection.js

import React from 'react';
// The user specified the CSS path as ../Style/
import '../Style/CtaSection.css'; 

// SVG Icons
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const HeadsetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
);


const CtaSection = () => {
    return (
        <section className="cta-section">
            <h2 className="cta-title">
                READY TO START YOUR
                <span className="cta-highlight"> JEWELRY JOURNEY?</span>
            </h2>
            <p className="cta-description">
                Join thousands of collectors and enthusiasts in our exclusive auction community
            </p>
            <div className="cta-buttons">
                <button className="cta-button primary">
                    <UserIcon />
                    Create Account
                </button>
                <button className="cta-button secondary">
                    <HeadsetIcon />
                    Contact Us
                </button>
            </div>
        </section>
    );
};

export default CtaSection;