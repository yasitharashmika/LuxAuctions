import React, { useState, useEffect, useMemo } from 'react'; // --- ADDED useMemo ---
import '../Style/Auctions.css'; // Assuming styles are here

// --- Auction Card Component (Keep as is) ---
const AuctionCardEnhanced = ({ auction }) => {
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/600x400/f8f9fa/2c3e50?text=Jewelry+Image&font=poppins`;
    };
    const getFullImageUrl = (relativeUrl) => {
        if (!relativeUrl) {
            return `https://placehold.co/600x400/f8f9fa/2c3e50?text=No+Image&font=poppins`;
        }
        return `https://localhost:7019${relativeUrl}`;
    };

    return (
        <div className="auction-card-premium">
            <div className="auction-image-container-premium">
                <img src={getFullImageUrl(auction.imageUrl)} alt={auction.title} onError={handleImageError} />
                <span className="category-tag-premium">{auction.category}</span>
                <button className="like-button-premium" aria-label="Like this item">
                    <i className="far fa-heart"></i>
                </button>
            </div>
            <div className="auction-info-premium">
                <h3>{auction.title}</h3>
                <p className="seller-name-premium">by {auction.sellerName || 'Verified Seller'}</p>
                <div className="bid-details-premium">
                    <div>
                        <span className="label-premium">Current Bid</span>
                        <span className="value-premium current-bid-value-premium">${(auction.currentBid ?? 0).toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="label-premium">Total Bids</span>
                        <span className="value-premium">{auction.bids ?? 0}</span>
                    </div>
                </div>
                <div className="time-left-premium">
                    <i className="far fa-clock"></i> {auction.timeLeft || 'Time Ending Soon'}
                </div>
                <div className="auction-actions-premium">
                    <button className="view-details-btn-premium">View Details</button>
                    <button className="place-bid-btn-premium">Place Bid</button>
                </div>
            </div>
        </div>
    );
};


// --- Main Live Auctions Component ---
const LiveAuctionsEnhanced = () => {
    // State for data, loading, error
    const [auctions, setAuctions] = useState([]); // Original fetched data
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [priceRange, setPriceRange] = useState('All');
    const [sortBy, setSortBy] = useState('Ending Soon'); // Default sort

    // Fetch data effect (keep as is)
    useEffect(() => {
        const fetchActiveAuctions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("https://localhost:7019/api/listings/active");
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
                    throw new Error(errorData.message || `Failed to fetch active auctions.`);
                }
                const data = await response.json();
                setAuctions(data);
            } catch (err) {
                console.error("Error fetching active auctions:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActiveAuctions();
    }, []);

    // --- NEW: useMemo for filtering and sorting ---
    const displayedAuctions = useMemo(() => {
        let filtered = [...auctions]; // Create a copy to avoid mutating original data

        // 1. Filter by Search Term (Title or Seller Name)
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(auction =>
                auction.title?.toLowerCase().includes(lowerSearchTerm) ||
                auction.sellerName?.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // 2. Filter by Category
        if (category !== 'All') {
            filtered = filtered.filter(auction => auction.category === category);
        }

        // 3. Filter by Price Range (Current Bid)
        if (priceRange !== 'All') {
            const [minStr, maxStr] = priceRange.split('-');
            const minPrice = minStr === 'Under' ? 0 : parseInt(minStr, 10);
            const maxPrice = maxStr === undefined ? Infinity : parseInt(maxStr, 10); // Handle 'Over X' case too if needed

             if (priceRange === 'Under 1000') {
                 filtered = filtered.filter(auction => auction.currentBid < 1000);
             } else if (priceRange === 'Over 10000') {
                 filtered = filtered.filter(auction => auction.currentBid >= 10000);
             }
             else if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                 filtered = filtered.filter(auction =>
                    auction.currentBid >= minPrice && auction.currentBid < maxPrice // Assuming range is min inclusive, max exclusive for 1000-5000
                );
            }
            // Add adjustments if your ranges are inclusive/exclusive differently
        }

        // 4. Sort the filtered results
        switch (sortBy) {
            case 'Newly Listed':
                // Assumes higher ID means newer. Replace with actual date if available.
                filtered.sort((a, b) => b.id - a.id);
                break;
            case 'Most Bids':
                filtered.sort((a, b) => (b.bids ?? 0) - (a.bids ?? 0));
                break;
            case 'Price High to Low':
                filtered.sort((a, b) => (b.currentBid ?? 0) - (a.currentBid ?? 0));
                break;
            case 'Price Low to High':
                filtered.sort((a, b) => (a.currentBid ?? 0) - (b.currentBid ?? 0));
                break;
            case 'Ending Soon':
            default:
                 // Basic sort based on timeLeft string. More complex parsing needed for accuracy.
                 // This simple sort might put "1d" before "10h" incorrectly.
                 // Ideally, sort by an actual endTime timestamp from the backend.
                filtered.sort((a, b) => (a.timeLeft || '').localeCompare(b.timeLeft || ''));
                break;
        }

        return filtered; // Return the processed list

        // Dependencies: Recalculate when original data or any filter changes
    }, [auctions, searchTerm, category, priceRange, sortBy]);
    // --- End useMemo ---

    return (
        <div className="live-auctions-enhanced">
            {/* Header (Unchanged) */}
            <header className="auctions-header-premium">
                <h1>LIVE <span>AUCTIONS</span></h1>
                <p>Discover exceptional jewelry pieces from verified sellers and prestigious collections worldwide</p>
            </header>

            {/* Filter Bar (Unchanged - state updates handled) */}
            <section className="filter-bar-premium">
                 <input
                     type="text"
                     placeholder="Search jewelry, brands, or sellers..."
                     className="search-input-enhanced"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <select value={category} onChange={(e) => setCategory(e.target.value)}>
                     <option value="All">All Categories</option>
                     <option value="Rings">Rings</option>
                     <option value="Necklaces">Necklaces</option>
                     <option value="Earrings">Earrings</option>
                     <option value="Bracelets">Bracelets</option>
                     <option value="Brooches">Brooches</option>
                 </select>
                 <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                     <option value="All">All Prices</option>
                     <option value="Under 1000">Under $1,000</option>
                     <option value="1000-5000">$1,000 - $5,000</option>
                     <option value="5000-10000">$5,000 - $10,000</option>
                     <option value="Over 10000">Over $10,000</option>
                 </select>
                 <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                     <option value="Ending Soon">Ending Soon</option>
                     <option value="Newly Listed">Newly Listed</option>
                     <option value="Most Bids">Most Bids</option>
                     <option value="Price High to Low">Price High to Low</option>
                     <option value="Price Low to High">Price Low to High</option>
                 </select>
            </section>

            {/* Results Info (Updated count) */}
            <div className="results-info-enhanced">
                <span>
                    {isLoading ? 'Loading exquisite pieces...' : `Showing ${displayedAuctions.length} of ${auctions.length} luxury auctions`}
                </span>
                <button className="more-filters-btn-enhanced">
                    <i className="fas fa-filter"></i> More Filters
                </button>
            </div>

            {/* Main Grid (Uses displayedAuctions now) */}
            <main className="auctions-grid-premium">
                {isLoading ? (
                    <div className="loading-state-premium">
                        <i className="fas fa-spinner fa-spin" style={{fontSize: '2rem', marginBottom: '15px'}}></i>
                        <p>Loading luxury auctions...</p>
                    </div>
                ) : error ? (
                    <div className="error-state-premium">
                        <i className="fas fa-exclamation-triangle" style={{fontSize: '2rem', marginBottom: '15px'}}></i>
                        <p>Error loading auctions: {error}</p>
                    </div>
                // Check displayedAuctions length after filtering/sorting
                ) : displayedAuctions.length > 0 ? (
                    displayedAuctions.map(auction => (
                        <AuctionCardEnhanced key={auction.id} auction={auction} />
                    ))
                ) : (
                    // Show no results message if filters yield empty list
                    <div className="loading-state-premium"> {/* Reuse class for styling */}
                        <i className="far fa-gem" style={{fontSize: '2rem', marginBottom: '15px'}}></i>
                        <p>No active auctions found matching your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LiveAuctionsEnhanced;