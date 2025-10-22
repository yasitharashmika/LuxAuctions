import React, { useState } from 'react';
import "../style/SellerDashboad.css";
import { useNavigate } from 'react-router-dom';
import necklaceImg from '../assets/OIP.jpg';

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate(); // Add this line
    
    // Sample data - replace with actual API data
    const [listings, setListings] = useState([
        {
            id: 1,
            title: "Victorian Diamond Necklace",
            category: "Necklace",
            startingBid: 15000,
            currentBid: 18500,
            bids: 12,
            status: "active",
            timeLeft: "2d 15h",
            image: necklaceImg
        },
        {
            id: 2,
            title: "Art Deco Emerald Ring",
            category: "Ring",
            startingBid: 8500,
            currentBid: 9200,
            bids: 8,
            status: "active",
            timeLeft: "1d 8h",
            image: "/api/placeholder/300/200"
        },
        {
            id: 3,
            title: "Cartier Pearl Earrings",
            category: "Earrings",
            startingBid: 12000,
            currentBid: 12000,
            bids: 0,
            status: "upcoming",
            timeLeft: "Starts in 3d",
            image: "/api/placeholder/300/200"
        }
    ]);

    const stats = {
        totalSales: 457000,
        activeListings: 8,
        totalBids: 156,
        soldItems: 23
    };

    const recentActivity = [
        { id: 1, item: "Victorian Diamond Necklace", bidder: "john_doe", amount: 18500, time: "2 hours ago" },
        { id: 2, item: "Art Deco Emerald Ring", bidder: "jane_smith", amount: 9200, time: "5 hours ago" },
        { id: 3, item: "Victorian Diamond Necklace", bidder: "collector88", amount: 18200, time: "1 day ago" }
    ];

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

            {/* Rest of your existing code remains exactly the same */}
            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>${(stats.totalSales / 1000).toFixed(0)}K</h3>
                        <p>Total Sales</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <h3>{stats.activeListings}</h3>
                        <p>Active Listings</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-info">
                        <h3>{stats.totalBids}</h3>
                        <p>Total Bids</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>{stats.soldItems}</h3>
                        <p>Sold Items</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="dashboard-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('listings')}
                >
                    My Listings
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                    onClick={() => setActiveTab('activity')}
                >
                    Activity
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    Analytics
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-content">
                        {/* Active Listings */}
                        <div className="section">
                            <h2>Active Listings</h2>
                            <div className="listings-grid">
                                {listings.filter(item => item.status === 'active').map(item => (
                                    <div key={item.id} className="listing-card">
                                        <div className="listing-image">
                                            <img src={item.image} alt={item.title} />
                                            <span className="status-badge active">Live</span>
                                        </div>
                                        <div className="listing-info">
                                            <h4>{item.title}</h4>
                                            <p className="category">{item.category}</p>
                                            <div className="bid-info">
                                                <div className="current-bid">
                                                    <span>Current Bid</span>
                                                    <strong>${item.currentBid.toLocaleString()}</strong>
                                                </div>
                                                <div className="bids-count">
                                                    <span>Bids</span>
                                                    <strong>{item.bids}</strong>
                                                </div>
                                            </div>
                                            <div className="time-left">
                                                <span>⏰ {item.timeLeft}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="section">
                            <h2>Recent Activity</h2>
                            <div className="activity-list">
                                {recentActivity.map(activity => (
                                    <div key={activity.id} className="activity-item">
                                        <div className="activity-details">
                                            <strong>{activity.bidder}</strong> placed a bid of 
                                            <span className="bid-amount"> ${activity.amount.toLocaleString()}</span> on {activity.item}
                                        </div>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'listings' && (
                    <div className="listings-content">
                        <div className="listings-header">
                            <h2>All Listings</h2>
                            <div className="filter-options">
                                <select>
                                    <option>All Status</option>
                                    <option>Active</option>
                                    <option>Upcoming</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                        </div>
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
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listings.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="item-info">
                                                    <img src={item.image} alt={item.title} />
                                                    <span>{item.title}</span>
                                                </div>
                                            </td>
                                            <td>{item.category}</td>
                                            <td>${item.startingBid.toLocaleString()}</td>
                                            <td>${item.currentBid.toLocaleString()}</td>
                                            <td>{item.bids}</td>
                                            <td>
                                                <span className={`status ${item.status}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-edit">Edit</button>
                                                    <button className="btn-delete">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="activity-content">
                        <h2>Bid Activity</h2>
                        <div className="full-activity-list">
                            {recentActivity.map(activity => (
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
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="analytics-content">
                        <h2>Sales Analytics</h2>
                        <div className="analytics-grid">
                            <div className="chart-placeholder">
                                <h3>Revenue Overview</h3>
                                <p>Chart will be displayed here</p>
                            </div>
                            <div className="chart-placeholder">
                                <h3>Bid Activity</h3>
                                <p>Chart will be displayed here</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;