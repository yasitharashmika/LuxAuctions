import React, { useState, useEffect } from 'react';
import "../style/SellerDashboad.css"; // Make sure this CSS exists and styles the elements used
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState('listings'); // Default to 'listings' tab maybe?
    const navigate = useNavigate();
    const [listings, setListings] = useState([]); // State for fetched listings
    const [isLoading, setIsLoading] = useState(true); // Loading state for fetch
    const [error, setError] = useState(null); // Error state for fetch/delete
    const [deletingId, setDeletingId] = useState(null); // Track which listing is being deleted

    // --- Fetch Listings Effect ---
    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true); // Start loading indicator
            setError(null); // Clear previous errors
            const token = localStorage.getItem("token");

            // Redirect to login if no token is found
            if (!token) {
                navigate('/login', { state: { message: "Session expired or user not logged in. Please log in." } });
                return; // Stop execution
            }

            try {
                // Make the API call to get the seller's listings
                const response = await fetch("https://localhost:7019/api/listings/my-listings", {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // 'Content-Type': 'application/json' // Not needed for GET
                    }
                });

                // Handle authorization errors (token invalid/expired or wrong role)
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem("token"); // Clear bad token
                        navigate('/login', { state: { message: "Authentication failed. Please log in again." } });
                    } else {
                        // Handle other potential errors (like 500 Internal Server Error)
                        const errorData = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
                        throw new Error(errorData.message || `Failed to fetch listings.`);
                    }
                    return; // Stop execution after handling error
                }

                // If response is OK, parse the JSON data
                const data = await response.json();
                setListings(data); // Update the listings state

            } catch (err) {
                console.error("Error fetching listings:", err);
                setError(err.message || "Could not fetch listings.");
                // Optionally redirect on specific network errors if desired
            } finally {
                setIsLoading(false); // Stop loading indicator
            }
        };

        fetchListings(); // Execute the fetch function when component mounts

        // Dependency array: runs when 'navigate' function reference changes (effectively once)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);
    // --- End Fetch Listings Effect ---

    // --- Handle Delete Function ---
    const handleDelete = async (listingId) => {
        // Use window.confirm for a simple confirmation dialog
        if (!window.confirm(`Are you sure you want to permanently delete listing #${listingId}?`)) {
            return; // Abort if user cancels
        }

        setDeletingId(listingId); // Set loading state for this specific item
        setError(null); // Clear previous errors
        const token = localStorage.getItem("token");

        // Double-check token existence
        if (!token) {
             setError("Authentication error. Please log in again.");
             setDeletingId(null);
             navigate('/login');
             return;
        }

        try {
            // Make the DELETE request to the backend
            const response = await fetch(`https://localhost:7019/api/listings/${listingId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                    // No 'Content-Type' or 'Accept' needed typically for DELETE with no body/response body expected
                }
            });

            // Check response status
            if (!response.ok) {
                let errorMsg = `Error ${response.status}: Failed to delete listing.`;
                // Provide more specific feedback based on status code
                if (response.status === 404) {
                    errorMsg = "Listing not found or you don't have permission to delete it.";
                } else if (response.status === 401 || response.status === 403) {
                     errorMsg = "Authentication failed. Please log in again.";
                     localStorage.removeItem("token"); // Clear bad token
                     navigate('/login'); // Redirect to login
                } else {
                     try { // Attempt to get a more specific error message from the backend response body
                        const errorData = await response.json();
                        errorMsg = errorData?.message || errorMsg;
                     } catch(_) { /* Ignore if body isn't JSON */ }
                }
                throw new Error(errorMsg);
            }

            // If DELETE was successful (status 204 No Content typically), update the UI state
            setListings(prevListings => prevListings.filter(item => item.id !== listingId));
            // Optionally show a success message (e.g., using a toast notification library)
             console.log(`Listing #${listingId} deleted successfully.`);
            // alert(`Listing #${listingId} deleted successfully.`); // Simple alert confirmation

        } catch (err) {
            console.error("Delete Error:", err);
            setError(err.message); // Display the error message on the dashboard
        } finally {
            setDeletingId(null); // Clear the loading state for the button
        }
    };
    // --- End Handle Delete Function ---

    // --- Placeholder Data & Helper Functions ---
    // (Keep the sample stats/activity and getFullImageUrl function)
    const stats = {
        totalSales: 457000, // Placeholder
        activeListings: isLoading ? 0 : listings.filter(l => l.status === 'Active').length, // Derived from fetched data
        totalBids: 156, // Placeholder
        soldItems: isLoading ? 0 : listings.filter(l => l.status === 'Sold').length // Derived (though status needs updating logic)
    };
    const recentActivity = [ /* Sample data remains */
         { id: 1, item: "Example Necklace", bidder: "john_doe", amount: 18500, time: "2 hours ago" },
         { id: 2, item: "Example Ring", bidder: "jane_smith", amount: 9200, time: "5 hours ago" },
    ];
    const getFullImageUrl = (relativeUrl) => {
        if (!relativeUrl) return `https://placehold.co/60x40/EEE/31343C?text=No+Img`;
        // Ensure the base URL matches your backend's HTTPS configuration
        return `https://localhost:7019${relativeUrl}`;
    };
    // --- End Placeholder Data & Helpers ---

    return (
        <div className="seller-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1>Seller Dashboard</h1>
                <p>Manage your jewelry listings and track your auctions</p>
                <button className="btn-primary" onClick={() => navigate('/create-listing')}>
                    + Create New Listing
                </button>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                 <div className="stat-card">
                     <div className="stat-icon">💰</div><div className="stat-info"><h3>${(stats.totalSales / 1000).toFixed(0)}K</h3><p>Total Sales</p></div>
                 </div>
                 <div className="stat-card">
                     <div className="stat-icon">📋</div><div className="stat-info"><h3>{isLoading ? '...' : listings.length}</h3><p>Total Listings</p></div>
                 </div>
                 <div className="stat-card">
                     <div className="stat-icon">⚡</div><div className="stat-info"><h3>{isLoading ? '...' : stats.activeListings}</h3><p>Active Listings</p></div>
                 </div>
                 <div className="stat-card">
                     <div className="stat-icon">✅</div><div className="stat-info"><h3>{isLoading ? '...' : stats.soldItems}</h3><p>Sold Items</p></div>
                 </div>
            </div>

            {/* Navigation Tabs */}
            <div className="dashboard-tabs">
                 <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}> Overview </button>
                 <button className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}> My Listings </button>
                 <button className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}> Activity </button>
                 <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}> Analytics </button>
             </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* --- Loading and General Error Display --- */}
                {isLoading && <div className="loading-indicator">Loading your listings... Please wait.</div>}
                {/* Display general fetch error only if not loading */}
                {error && !isLoading && <div className="error-message">Error: {error}</div>}

                {/* --- Overview Tab --- */}
                {activeTab === 'overview' && !isLoading && !error && (
                    <div className="overview-content">
                        {/* Active Listings Section */}
                        <div className="section">
                            <h2>Active Listings ({stats.activeListings})</h2>
                            {stats.activeListings > 0 ? (
                                <div className="listings-grid">
                                    {listings.filter(item => item.status === 'Active').map(item => (
                                        <div key={item.id} className="listing-card">
                                            <div className="listing-image">
                                                <img src={getFullImageUrl(item.imageUrl)} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/300x200/EEE/31343C?text=Img+Error`; }} />
                                                <span className={`status-badge ${item.status?.toLowerCase()}`}>{item.status}</span>
                                            </div>
                                            <div className="listing-info">
                                                <h4>{item.title}</h4> <p className="category">{item.category}</p>
                                                <div className="bid-info">
                                                    <div className="current-bid"><span>Current Bid</span><strong>${item.currentBid.toLocaleString()}</strong></div>
                                                    <div className="bids-count"><span>Bids</span><strong>{item.bids}</strong></div>
                                                </div>
                                                <div className="time-left"><span>⏰ {item.timeLeft}</span></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (<p>You have no active listings at the moment.</p>)}
                        </div>

                        {/* Recent Activity Section (Sample) */}
                        <div className="section">
                            <h2>Recent Activity (Sample)</h2>
                            <div className="activity-list">
                                {recentActivity.length > 0 ? recentActivity.map(activity => (
                                    <div key={activity.id} className="activity-item">
                                        <div className="activity-details"><strong>{activity.bidder}</strong> placed bid of <span className="bid-amount">${activity.amount.toLocaleString()}</span> on {activity.item}</div>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                )) : <p>No recent bid activity.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Listings Tab --- */}
                {activeTab === 'listings' && !isLoading && !error && (
                    <div className="listings-content">
                        <div className="listings-header">
                            <h2>All My Listings ({listings.length})</h2>
                            {/* Potential Filter Dropdown */}
                        </div>

                        {/* Display delete-specific errors here if needed */}
                        {/* {error && deletingId && <div className="error-message">Error deleting item: {error}</div>} */}

                        {listings.length > 0 ? (
                            <div className="listings-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Category</th>
                                            <th>Starting Bid</th>
                                            <th>Current Bid</th>
                                            <th>Bids</th>
                                            <th>Status</th>
                                            <th>Time Left</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listings.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="item-info">
                                                        <img src={getFullImageUrl(item.imageUrl)} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/60x40/EEE/31343C?text=Err`; }}/>
                                                        <span>{item.title}</span>
                                                    </div>
                                                </td>
                                                <td>{item.category}</td>
                                                <td>${item.startingBid.toLocaleString()}</td>
                                                <td>${item.currentBid.toLocaleString()}</td>
                                                <td>{item.bids}</td>
                                                <td><span className={`status ${item.status?.toLowerCase()}`}>{item.status}</span></td>
                                                <td>{item.timeLeft}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {/* Delete Button with handler and loading state */}
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => handleDelete(item.id)}
                                                            disabled={deletingId === item.id} // Disable only the button being clicked
                                                        >
                                                            {deletingId === item.id ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>You have not created any listings yet. <button className="link-button" onClick={() => navigate('/create-listing')}>Create one now?</button></p>
                        )}
                    </div>
                )}

                 {/* --- Activity Tab (Sample) --- */}
                 {activeTab === 'activity' && (
                     <div className="activity-content">
                         <h2>Bid Activity (Sample)</h2>
                         <div className="full-activity-list">
                             {recentActivity.length > 0 ? recentActivity.map(activity => (
                                 <div key={activity.id} className="activity-card">
                                      <div className="activity-main">
                                         <div className="activity-icon">💰</div>
                                         <div className="activity-text">
                                             <strong>New Bid</strong>
                                             <p>{activity.bidder} bid on {activity.item}</p>
                                             <span className="activity-time">{activity.time}</span>
                                         </div>
                                     </div>
                                     <div className="bid-amount">${activity.amount.toLocaleString()}</div>
                                 </div>
                             )) : <p>No recent bid activity.</p>}
                         </div>
                     </div>
                 )}

                 {/* --- Analytics Tab (Placeholder) --- */}
                 {activeTab === 'analytics' && (
                      <div className="analytics-content">
                          <h2>Sales Analytics</h2>
                          <p>Analytics section coming soon.</p>
                          <div className="analytics-grid">
                              <div className="chart-placeholder"><h3>Revenue Overview</h3><p>Chart here</p></div>
                              <div className="chart-placeholder"><h3>Bid Activity</h3><p>Chart here</p></div>
                          </div>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default SellerDashboard;