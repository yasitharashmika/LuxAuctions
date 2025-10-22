import React, { useState, useEffect } from "react";
import "../style/UserDashboard.css";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState({
    id: 1,
    name: "Anupa ",
    email: "anupa@gmail.com",
    phone: "+94771234567",
    membership: "VIP Client",
    joinDate: "2024-01-15",
    kycStatus: "verified",
    totalBids: 23,
    wonAuctions: 8,
    watchlistCount: 5,
    loyaltyPoints: 1250
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "outbid",
      title: "You've been outbid",
      message: "Someone placed a higher bid on Diamond Tennis Bracelet",
      time: "5 minutes ago",
      read: false,
      itemId: 101,
      action: "Place Higher Bid"
    },
    {
      id: 2,
      type: "auction_start",
      title: "New Auction Starting",
      message: "Rare Emerald Collection starts in 30 minutes",
      time: "1 hour ago",
      read: false,
      itemId: 102,
      action: "Set Reminder"
    },
    {
      id: 3,
      type: "won",
      title: "Auction Won!",
      message: "Congratulations! You won the Vintage Cartier Watch",
      time: "2 hours ago",
      read: true,
      itemId: 103,
      action: "Arrange Collection"
    },
    {
      id: 4,
      type: "price_drop",
      title: "Price Drop Alert",
      message: "Pearl Necklace you're watching dropped by 15%",
      time: "1 day ago",
      read: true,
      itemId: 104,
      action: "View Item"
    },
    {
      id: 5,
      type: "exclusive",
      title: "Exclusive Preview",
      message: "Preview our new diamond collection before public release",
      time: "2 days ago",
      read: true,
      itemId: 105,
      action: "View Collection"
    }
  ]);

  const [bids, setBids] = useState([
    {
      id: 1,
      itemId: 101,
      itemName: "Diamond Tennis Bracelet",
      itemImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop",
      currentBid: 12500,
      yourBid: 12000,
      status: "outbid",
      timeLeft: "2h 15m",
      endTime: "2024-01-25T18:00:00",
      gemstones: "Diamonds",
      metal: "White Gold"
    },
    {
      id: 2,
      itemId: 102,
      itemName: "Rare Emerald Ring",
      itemImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&h=150&fit=crop",
      currentBid: 8500,
      yourBid: 8500,
      status: "leading",
      timeLeft: "1d 4h",
      endTime: "2024-01-26T14:00:00",
      gemstones: "Emerald",
      metal: "Platinum"
    },
    {
      id: 3,
      itemId: 103,
      itemName: "Vintage Cartier Watch",
      itemImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=150&h=150&fit=crop",
      currentBid: 32000,
      yourBid: 32000,
      status: "won",
      timeLeft: "Ended",
      endTime: "2024-01-24T12:00:00",
      gemstones: "Diamonds",
      metal: "Yellow Gold"
    },
    {
      id: 4,
      itemId: 106,
      itemName: "Sapphire & Diamond Earrings",
      itemImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&h=150&fit=crop",
      currentBid: 7200,
      yourBid: 7000,
      status: "watching",
      timeLeft: "3d 2h",
      endTime: "2024-01-28T10:00:00",
      gemstones: "Sapphire & Diamond",
      metal: "White Gold"
    }
  ]);

  const [watchlist, setWatchlist] = useState([
    {
      id: 1,
      itemId: 104,
      itemName: "Pearl Necklace",
      itemImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&h=150&fit=crop",
      currentBid: 3500,
      startingPrice: 3000,
      timeLeft: "3d 2h",
      watchers: 12,
      gemstones: "Pearls",
      metal: "Sterling Silver"
    },
    {
      id: 2,
      itemId: 105,
      itemName: "Ruby & Diamond Ring",
      itemImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&h=150&fit=crop",
      currentBid: 9800,
      startingPrice: 8500,
      timeLeft: "1d 8h",
      watchers: 8,
      gemstones: "Ruby & Diamond",
      metal: "Rose Gold"
    },
    {
      id: 3,
      itemId: 107,
      itemName: "Art Deco Diamond Brooch",
      itemImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop",
      currentBid: 12500,
      startingPrice: 11000,
      timeLeft: "5d 6h",
      watchers: 15,
      gemstones: "Diamonds",
      metal: "Platinum"
    }
  ]);

  const [profileData, setProfileData] = useState({
    firstName: "Anupa",
    lastName: "Welikumbura",
    email: "anupa@gmail.com",
    phone: "+94771234567",
    address: "123 Park, Colombo,",
    preferredMetal: "White Gold",
    ringSize: "6.5",
    kycVerified: true
  });

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getBidStatusColor = (status) => {
    const colors = {
      leading: "#10B981",
      outbid: "#EF4444",
      won: "#8B5CF6",
      watching: "#3B82F6",
      lost: "#6B7280"
    };
    return colors[status] || "#6B7280";
  };

  const getNotificationIcon = (type) => {
    const icons = {
      outbid: "📉",
      auction_start: "⏰",
      won: "🎉",
      price_drop: "💰",
      exclusive: "👑"
    };
    return icons[type] || "💎";
  };

  const getMetalColor = (metal) => {
    const colors = {
      'White Gold': '#E8E8E8',
      'Yellow Gold': '#FFD700',
      'Rose Gold': '#E8B4A9',
      'Platinum': '#E5E4E2',
      'Sterling Silver': '#C0C0C0'
    };
    return colors[metal] || '#6B7280';
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="user-dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>LuxAuction Dashboard</h1>
            <p className="welcome-text">Welcome back, {userData.name}! 💎</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{unreadNotificationsCount}</span>
              <span className="stat-label">Unread Alerts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userData.loyaltyPoints}</span>
              <span className="stat-label">Loyalty Points</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            💎 Dashboard
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bids' ? 'active' : ''}`}
            onClick={() => setActiveTab('bids')}
          >
            🔨 My Bids
          </button>
          <button 
            className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            ⭐ Wishlist
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Alerts
          </button>
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="tab-content">
              {/* Stats Overview */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">💎</div>
                  <div className="stat-info">
                    <h3>{userData.totalBids}</h3>
                    <p>Active Bids</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-info">
                    <h3>{userData.wonAuctions}</h3>
                    <p>Pieces Won</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <h3>{userData.watchlistCount}</h3>
                    <p>Wishlist Items</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👑</div>
                  <div className="stat-info">
                    <h3>{userData.membership}</h3>
                    <p>Client Tier</p>
                  </div>
                </div>
              </div>

              {/* VIP Status Area */}
              <div className="content-section">
                <h2>VIP Client Status</h2>
                <div className="vip-status-card">
                  <div className="vip-header">
                    <h3>Exclusive Benefits</h3>
                    <span className="vip-badge">VIP Client</span>
                  </div>
                  <div className="vip-benefits">
                    <div className="benefit-item">
                      <span className="benefit-icon">🔒</span>
                      <span>Early Access to New Collections</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">💎</span>
                      <span>Personal Jewelry Consultant</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">🚚</span>
                      <span>White Glove Delivery Service</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">🛡️</span>
                      <span>Lifetime Authentication Guarantee</span>
                    </div>
                  </div>
                  <div className="loyalty-points">
                    <h4>Loyalty Points: {userData.loyaltyPoints}</h4>
                    <p>Redeem points for exclusive jewelry pieces and services</p>
                  </div>
                </div>
              </div>

              {/* Current Bids */}
              <div className="content-section">
                <h2>Current Bids</h2>
                <div className="bids-grid">
                  {bids.filter(bid => bid.status !== 'won').slice(0, 3).map(bid => (
                    <div key={bid.id} className="bid-card">
                      <img src={bid.itemImage} alt={bid.itemName} className="bid-image" />
                      <div className="bid-info">
                        <h4>{bid.itemName}</h4>
                        <div className="jewelry-specs">
                          <span className="gemstone">{bid.gemstones}</span>
                          <span 
                            className="metal-tag"
                            style={{ backgroundColor: getMetalColor(bid.metal) }}
                          >
                            {bid.metal}
                          </span>
                        </div>
                        <p className="bid-amount">Your Bid: ${bid.yourBid.toLocaleString()}</p>
                        <p className="current-bid">Current: ${bid.currentBid.toLocaleString()}</p>
                        <div className="bid-footer">
                          <span 
                            className="bid-status"
                            style={{ backgroundColor: getBidStatusColor(bid.status) }}
                          >
                            {bid.status}
                          </span>
                          <span className="time-left">{bid.timeLeft}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="content-section">
                <h2>Recent Alerts</h2>
                <div className="notifications-preview">
                  {notifications.slice(0, 3).map(notification => (
                    <div key={notification.id} className="notification-preview-item">
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-preview-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Bids Tab */}
          {activeTab === 'bids' && (
            <div className="tab-content">
              <div className="content-section">
                <h2>My Jewelry Bids</h2>
                <div className="bids-list">
                  {bids.map(bid => (
                    <div key={bid.id} className="bid-item">
                      <img src={bid.itemImage} alt={bid.itemName} className="bid-item-image" />
                      <div className="bid-item-info">
                        <h4>{bid.itemName}</h4>
                        <div className="jewelry-details">
                          <span className="gemstone">{bid.gemstones}</span>
                          <span 
                            className="metal-tag"
                            style={{ backgroundColor: getMetalColor(bid.metal) }}
                          >
                            {bid.metal}
                          </span>
                        </div>
                        <div className="bid-details">
                          <span>Your Bid: <strong>${bid.yourBid.toLocaleString()}</strong></span>
                          <span>Current: <strong>${bid.currentBid.toLocaleString()}</strong></span>
                          <span>Time Left: <strong>{bid.timeLeft}</strong></span>
                        </div>
                      </div>
                      <div className="bid-item-actions">
                        <span 
                          className="bid-status"
                          style={{ backgroundColor: getBidStatusColor(bid.status) }}
                        >
                          {bid.status}
                        </span>
                        <button className="view-item-btn">View Piece</button>
                        {bid.status === 'outbid' && (
                          <button className="bid-again-btn">Increase Bid</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'watchlist' && (
            <div className="tab-content">
              <div className="content-section">
                <h2>My Jewelry Wishlist</h2>
                <div className="watchlist-grid">
                  {watchlist.map(item => (
                    <div key={item.id} className="watchlist-card">
                      <img src={item.itemImage} alt={item.itemName} className="watchlist-image" />
                      <div className="watchlist-info">
                        <h4>{item.itemName}</h4>
                        <div className="jewelry-specs">
                          <span className="gemstone">{item.gemstones}</span>
                          <span 
                            className="metal-tag"
                            style={{ backgroundColor: getMetalColor(item.metal) }}
                          >
                            {item.metal}
                          </span>
                        </div>
                        <p className="current-bid">Current Bid: ${item.currentBid.toLocaleString()}</p>
                        <p className="starting-price">Start: ${item.startingPrice.toLocaleString()}</p>
                        <p className="time-left">Time Left: {item.timeLeft}</p>
                        <p className="watchers">⭐ {item.watchers} watchers</p>
                      </div>
                      <div className="watchlist-actions">
                        <button className="place-bid-btn">Place Bid</button>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromWatchlist(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="tab-content">
              <div className="content-section">
                <div className="notifications-header">
                  <h2>Jewelry Alerts</h2>
                  <button 
                    className="mark-all-read-btn"
                    onClick={markAllNotificationsAsRead}
                    disabled={unreadNotificationsCount === 0}
                  >
                    Mark All as Read
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                      onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <div className="notification-footer">
                          <span className="notification-time">{notification.time}</span>
                          <button className="notification-action">
                            {notification.action}
                          </button>
                        </div>
                      </div>
                      {!notification.read && <div className="unread-dot"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="content-section">
                <h2>Client Profile</h2>
                <form className="profile-form" onSubmit={handleProfileUpdate}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Delivery Address</label>
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Preferred Metal</label>
                      <select
                        name="preferredMetal"
                        value={profileData.preferredMetal}
                        onChange={handleInputChange}
                      >
                        <option value="White Gold">White Gold</option>
                        <option value="Yellow Gold">Yellow Gold</option>
                        <option value="Rose Gold">Rose Gold</option>
                        <option value="Platinum">Platinum</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Ring Size (US)</label>
                      <input
                        type="number"
                        step="0.5"
                        name="ringSize"
                        value={profileData.ringSize}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Update Profile
                    </button>
                    <button type="button" className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              {/* VIP Settings */}
              <div className="content-section">
                <h2>VIP Client Settings</h2>
                <div className="vip-settings">
                  <div className="setting-item">
                    <label>Client Tier</label>
                    <span className="vip-level">{userData.membership}</span>
                  </div>
                  <div className="setting-item">
                    <label>Loyalty Points</label>
                    <span className="loyalty-points">{userData.loyaltyPoints} points</span>
                  </div>
                  <div className="setting-item">
                    <label>Member Since</label>
                    <span className="join-date">{userData.joinDate}</span>
                  </div>
                  <div className="setting-item">
                    <label>Authentication Status</label>
                    <span className="auth-status verified">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;