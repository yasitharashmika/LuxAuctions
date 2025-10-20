// src/components/FeaturedAuctions.js

import React from 'react';
import '../Style/FeaturedAuctions.css'; // Import the CSS styles

// In a real app, this data would likely come from an API
const auctionData = [
    {
        id: 1,
        imageUrl: 'https://i.imgur.com/your-image-1.jpg', // Replace with your image URL
        category: 'Necklaces',
        title: 'VICTORIAN DIAMOND NECKLACE',
        seller: 'Heritage Jewelers',
        bid: '$15,000',
        timeLeft: '2d 13h 7m 15s',
    },
    {
        id: 2,
        imageUrl: 'https://i.imgur.com/your-image-2.jpg', // Replace with your image URL
        category: 'Rings',
        title: 'ART DECO EMERALD RING',
        seller: 'Vintage Luxe',
        bid: '$8,500',
        timeLeft: '1d 6h 50m 15s',
    },
    {
        id: 3,
        imageUrl: 'https://i.imgur.com/your-image-3.jpg', // Replace with your image URL
        category: 'Earrings',
        title: 'CARTIER PEARL EARRINGS',
        seller: 'Elite Collections',
        bid: '$12,000',
        timeLeft: '3d 1h 20m 15s',
    },
];

// SVG icons defined directly in the component file for simplicity
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.835 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 ml-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
    </svg>
);


const FeaturedAuctions = () => {
    return (
        <div className="featured-auctions">
            <h2 className="featured-auctions-title">
                FEATURED <span className="highlight">AUCTIONS</span>
            </h2>
            <p className="featured-auctions-description">
                Discover exceptional pieces from renowned collections and private estates
            </p>

            <div className="auction-items-grid">
                {auctionData.map(item => (
                    <div className="auction-card" key={item.id}>
                        <div className="auction-image-container">
                            <img src={item.imageUrl} alt={item.title} className="auction-image" />
                            <span className={`auction-category ${item.category.toLowerCase()}`}>{item.category}</span>
                            <button className="favorite-button">
                                <HeartIcon />
                            </button>
                        </div>
                        <div className="auction-details">
                            <h3 className="item-title">{item.title}</h3>
                            <p className="seller">by {item.seller}</p>
                            <p className="current-bid-label">Current Bid</p>
                            <p className="current-bid-value">{item.bid}</p>
                            <p className="time-left">
                                <ClockIcon />
                                {item.timeLeft}
                            </p>
                            <div className="auction-actions">
                                <button className="view-details-button">View Details</button>
                                <button className="place-bid-button">Place Bid</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* New "View All Auctions" Button */}
            <div className="view-all-auctions-container">
                <button className="view-all-auctions-button">
                    View All Auctions
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
    );
};

export default FeaturedAuctions;