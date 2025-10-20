import React, { useState } from 'react';
<<<<<<< Updated upstream

import '../style/CreateListing.css';
=======
import '../style/CreateListing.css'
>>>>>>> Stashed changes

const CreateListing = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        startingBid: '',
        reservePrice: '',
        auctionDuration: '7',
        materials: [],
        era: '',
        condition: 'excellent',
        weight: '',
        dimensions: '',
        certificates: false,
        shippingInfo: ''
    });

    const [images, setImages] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);

    const categories = [
        'Necklace', 'Ring', 'Earrings', 'Bracelet', 'Brooch', 
        'Watch', 'Tiaras', 'Cufflinks', 'Pendant', 'Other'
    ];

    const materials = [
        'Gold', 'Silver', 'Platinum', 'Diamonds', 'Emeralds',
        'Rubies', 'Sapphires', 'Pearls', 'Other Gemstones'
    ];

    const eras = [
        'Victorian', 'Art Nouveau', 'Art Deco', 'Retro',
        'Modern', 'Contemporary', 'Antique'
    ];

    const conditions = [
        { value: 'excellent', label: 'Excellent - Like new' },
        { value: 'very-good', label: 'Very Good - Minor wear' },
        { value: 'good', label: 'Good - Visible wear' },
        { value: 'fair', label: 'Fair - Needs restoration' }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleMaterialToggle = (material) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.includes(material)
                ? prev.materials.filter(m => m !== material)
                : [...prev.materials, material]
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        // In a real app, you would upload to cloud storage
        setImages(prev => [...prev, ...files.slice(0, 5 - prev.length)]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', { ...formData, images });
        alert('Listing created successfully!');
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderStep1 = () => (
        <div className="form-step">
            <h3>Basic Information</h3>
            <div className="form-group">
                <label>Item Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Victorian Diamond Necklace"
                    required
                />
            </div>

            <div className="form-group">
                <label>Category *</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your jewelry piece in detail..."
                    rows="4"
                    required
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="form-step">
            <h3>Pricing & Auction Details</h3>
            <div className="form-row">
                <div className="form-group">
                    <label>Starting Bid ($) *</label>
                    <input
                        type="number"
                        name="startingBid"
                        value={formData.startingBid}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Reserve Price ($)</label>
                    <input
                        type="number"
                        name="reservePrice"
                        value={formData.reservePrice}
                        onChange={handleInputChange}
                        placeholder="Optional"
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Auction Duration *</label>
                <select
                    name="auctionDuration"
                    value={formData.auctionDuration}
                    onChange={handleInputChange}
                    required
                >
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                </select>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="form-step">
            <h3>Item Details & Specifications</h3>
            
            <div className="form-group">
                <label>Materials & Gemstones</label>
                <div className="materials-grid">
                    {materials.map(material => (
                        <label key={material} className="material-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.materials.includes(material)}
                                onChange={() => handleMaterialToggle(material)}
                            />
                            <span className="checkmark"></span>
                            {material}
                        </label>
                    ))}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Era / Period</label>
                    <select
                        name="era"
                        value={formData.era}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Era</option>
                        {eras.map(era => (
                            <option key={era} value={era}>{era}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Condition</label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                    >
                        {conditions.map(cond => (
                            <option key={cond.value} value={cond.value}>
                                {cond.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Weight (grams)</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label>Dimensions</label>
                    <input
                        type="text"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        placeholder="e.g., 45cm length"
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="certificates"
                        checked={formData.certificates}
                        onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    This item comes with authenticity certificates
                </label>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="form-step">
            <h3>Images & Final Details</h3>
            
            <div className="form-group">
                <label>Upload Images *</label>
                <div className="image-upload-area">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="image-input"
                    />
                    <div className="upload-placeholder">
                        <div className="upload-icon">📷</div>
                        <p>Click to upload images</p>
                        <small>Maximum 5 images • PNG, JPG, WEBP</small>
                    </div>
                </div>

                <div className="image-preview-grid">
                    {images.map((image, index) => (
                        <div key={index} className="image-preview">
                            <img 
                                src={URL.createObjectURL(image)} 
                                alt={`Preview ${index + 1}`} 
                            />
                            <button 
                                type="button" 
                                className="remove-image"
                                onClick={() => removeImage(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Shipping Information</label>
                <textarea
                    name="shippingInfo"
                    value={formData.shippingInfo}
                    onChange={handleInputChange}
                    placeholder="Describe shipping options, costs, and handling..."
                    rows="3"
                />
            </div>

            <div className="form-group">
                <label className="checkbox-label">
                    <input type="checkbox" required />
                    <span className="checkmark"></span>
                    I confirm that this listing complies with LuxAuction's policies and terms of service
                </label>
            </div>
        </div>
    );

    return (
        <div className="create-listing-page">
            <div className="listing-header">
                <h1>Create New Listing</h1>
                <p>Showcase your jewelry to thousands of collectors and enthusiasts</p>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
                <div className="progress-steps">
                    {[1, 2, 3, 4].map(step => (
                        <div key={step} className={`step ${step === currentStep ? 'active' : step < currentStep ? 'completed' : ''}`}>
                            <div className="step-number">{step}</div>
                            <span className="step-label">
                                {step === 1 && 'Basic Info'}
                                {step === 2 && 'Pricing'}
                                {step === 3 && 'Details'}
                                {step === 4 && 'Images'}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="progress-line">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${(currentStep - 1) / 3 * 100}%` }}
                    ></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="listing-form">
                {/* Step Content */}
                <div className="form-content">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                </div>

                {/* Navigation Buttons */}
                <div className="form-navigation">
                    {currentStep > 1 && (
                        <button type="button" className="btn-secondary" onClick={prevStep}>
                            ← Previous
                        </button>
                    )}
                    
                    <div className="nav-right">
                        {currentStep < 4 ? (
                            <button type="button" className="btn-primary" onClick={nextStep}>
                                Next Step →
                            </button>
                        ) : (
                            <button type="submit" className="btn-submit">
                                🎯 Create Listing
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Quick Tips */}
            <div className="quick-tips">
                <h3>💡 Listing Tips</h3>
                <ul>
                    <li>Use high-quality, well-lit photos from multiple angles</li>
                    <li>Provide detailed descriptions including any imperfections</li>
                    <li>Research similar items to set competitive starting bids</li>
                    <li>Be transparent about item condition and history</li>
                </ul>
            </div>
        </div>
    );
};

export default CreateListing;