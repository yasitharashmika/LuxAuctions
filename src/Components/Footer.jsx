// src/components/Footer.js

import React from 'react';
// Following the path convention you specified earlier
import '../Style/Footer.css'; 

// SVG Icons for social media - all tags are now self-closed with "/>"
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96s4.46 9.96 9.96 9.96c5.5 0 9.96-4.46 9.96-9.96S17.5 2.04 12 2.04zm2.62 9.44h-1.92v6.62h-2.76v-6.62h-1.36V9.82h1.36V8.2c0-1.22.62-2.18 2.18-2.18h1.5v2.4h-1.04c-.24 0-.42.18-.42.42v1h1.46l-.2 2.62z" />
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96s4.46 9.96 9.96 9.96c5.5 0 9.96-4.46 9.96-9.96S17.5 2.04 12 2.04zm4.2 8.1s-.38 1.7-1.74 2.42c.8.1 1.6-.22 1.6-.22s-.3.8-.92 1.32c.74.1 1.48-.34 1.48-.34s-.46.86-1.2 1.2c-.08.52.12 2.4-2.4 3.96-1.52.94-4.22.9-5.18.28.46.04.9-.1 1.18-.16-.08-1.7-.3-2.92-1.28.24.02.48.04.72.04 1.04 0 2-.36 2.76-1-.5-.02-1.12-.22-1.44-.9s-.28-1.28-.22-1.36c.32.06.62.1.92.1-.26-.18-.84-.58-.94-1.22s.1-1.3.1-1.3c.54.3 1.14.48 1.76.52-.64-.44-.92-1.72-.5-2.52.42-.8 1.34-1.5 2.5-1.72.3-.04.6-.04.88-.02z" />
    </svg>
);

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-top">
                    <div className="footer-about">
                        <div className="footer-logo">
                            <div className="logo-icon">L</div>
                            <div className="logo-text">
                                <span className="logo-main">LUXAUCTION</span>
                                <span className="logo-sub">Premium Jewelry</span>
                            </div>
                        </div>
                        <p className="footer-description">
                            Where timeless jewelry meets digital elegance. Discover rare pieces, bid on exclusive collections, and own extraordinary jewelry from around the world.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-icon"><FacebookIcon /></a>
                            <a href="#" className="social-icon"><InstagramIcon /></a>
                            <a href="#" className="social-icon"><TwitterIcon /></a>
                        </div>
                    </div>

                    <div className="footer-links-column">
                        <h3 className="footer-heading">Quick Links</h3>
                        <ul className="footer-links">
                            <li><a href="#">Browse Auctions</a></li>
                            <li><a href="#">Sell Jewelry</a></li>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-links-column">
                        <h3 className="footer-heading">Support</h3>
                        <ul className="footer-links">
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Shipping Info</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 LuxAuction. All rights reserved.</p>
                    
                    
                </div>
            </div>
        </footer>
    );
};

export default Footer;