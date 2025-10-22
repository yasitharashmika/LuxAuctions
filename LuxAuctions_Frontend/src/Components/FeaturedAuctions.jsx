import React, { useState, useEffect } from 'react'; // ADDED useState, useEffect
import '../Style/FeaturedAuctions.css'; // Import the CSS styles

// --- SVG Icons (keep as they are) ---
const HeartIcon = () => ( /* ... SVG ... */ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.835 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg> );
const ClockIcon = () => ( /* ... SVG ... */ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> );
const ArrowRightIcon = () => ( /* ... SVG ... */ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg> );
// --- End SVG Icons ---


// --- Auction Card Component (Update fields) ---
const FeaturedAuctionCard = ({ item }) => {

    const getFullImageUrl = (relativeUrl) => {
        if (!relativeUrl) return `https://placehold.co/600x400/f0f0f0/ccc?text=No+Image`;
        return `https://localhost:7019${relativeUrl}`; // Adjust if your backend URL differs
    };

     const handleImageError = (e) => {
        e.target.onerror = null; // Prevent loops
        e.target.src = `https://placehold.co/600x400/f0f0f0/ccc?text=Load+Error`;
    };


    return (
        <div className="auction-card" key={item.id}>
            <div className="auction-image-container">
                <img
                    src={getFullImageUrl(item.imageUrl)} // Use DTO field
                    alt={item.title}
                    className="auction-image"
                    onError={handleImageError}
                 />
                <span className={`auction-category ${item.category?.toLowerCase()}`}>{item.category}</span>
                <button className="favorite-button">
                    <HeartIcon />
                </button>
            </div>
            <div className="auction-details">
                <h3 className="item-title">{item.title}</h3>
                <p className="seller">by {item.sellerName || 'Unknown Seller'}</p> {/* Use DTO field */}
                <p className="current-bid-label">Current Bid</p>
                {/* Use DTO field and format */}
                <p className="current-bid-value">${(item.currentBid ?? 0).toLocaleString()}</p>
                <p className="time-left">
                    <ClockIcon />
                    {item.timeLeft || 'N/A'} {/* Use DTO field */}
                </p>
                <div className="auction-actions">
                    {/* TODO: Add onClick handlers */}
                    <button className="view-details-button">View Details</button>
                    <button className="place-bid-button">Place Bid</button>
                </div>
            </div>
        </div>
    );
};


// --- Main Featured Auctions Component ---
const FeaturedAuctions = () => {
    // State for fetched auctions, loading, and errors
    const [featuredItems, setFeaturedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        const fetchFeatured = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch from the new public endpoint (no token needed)
                const response = await fetch("https://localhost:7019/api/listings/featured?count=3"); // Fetch exactly 3

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
                    throw new Error(errorData.message || 'Failed to fetch featured auctions.');
                }

                const data = await response.json();
                setFeaturedItems(data); // Update state with fetched data

            } catch (err) {
                console.error("Error fetching featured auctions:", err);
                setError(err.message);
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        fetchFeatured(); // Call the function

        // Empty dependency array means this runs once on mount
    }, []);


    return (
        <div className="featured-auctions">
            <h2 className="featured-auctions-title">
                FEATURED <span className="highlight">AUCTIONS</span>
            </h2>
            <p className="featured-auctions-description">
                Discover exceptional pieces from renowned collections and private estates
            </p>

            {/* Conditionally render based on loading/error state */}
            {isLoading ? (
                <div className="loading-state">Loading featured items...</div> // Add a loading indicator style
            ) : error ? (
                <div className="error-state">Error: {error}</div> // Add an error style
            ) : featuredItems.length > 0 ? (
                // Render the grid if data is loaded successfully
                <div className="auction-items-grid">
                    {featuredItems.map(item => (
                        // Use the updated card component
                        <FeaturedAuctionCard item={item} key={item.id} />
                    ))}
                </div>
            ) : (
                // Show message if no featured items are found
                <p>No featured auctions available at the moment.</p>
            )}

            {/* "View All Auctions" Button */}
            <div className="view-all-auctions-container">
                {/* TODO: Add onClick navigation */}
                <button className="view-all-auctions-button">
                    View All Auctions
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
    );
};

export default FeaturedAuctions;