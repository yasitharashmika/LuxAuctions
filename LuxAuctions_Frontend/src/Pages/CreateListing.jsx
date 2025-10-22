import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/CreateListing.css'; // Make sure this CSS file exists and includes styles for '.field-error' and '.form-error'

const CreateListing = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        category: '', // Initial value must be empty string for validation
        description: '',
        startingBid: '', // Initial value must be empty string for validation
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
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null); // For general errors
    const [fieldErrors, setFieldErrors] = useState({}); // For specific field errors

    // Check for login token when the component mounts
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Redirect to login if not logged in
            navigate('/login', { state: { message: "You must be logged in to create a listing." } });
        }
    }, [navigate]); // Run once on mount

    // --- Static data arrays (keep as they are) ---
    const categories = [ 'Necklace', 'Ring', 'Earrings', /* ... */ 'Other' ];
    const materials = [ 'Gold', 'Silver', 'Platinum', /* ... */ 'Other Gemstones' ];
    const eras = [ 'Victorian', 'Art Nouveau', /* ... */ 'Antique' ];
    const conditions = [
        { value: 'excellent', label: 'Excellent - Like new' },
        { value: 'very-good', label: 'Very Good - Minor wear' },
        { value: 'good', label: 'Good - Visible wear' },
        { value: 'fair', label: 'Fair - Needs restoration' }
    ];
    // ---

    // Update form data and clear validation error for the changed field
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear the specific error when the user types in the field
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const updatedErrors = { ...prev };
                delete updatedErrors[name]; // Remove the error for this field
                return updatedErrors;
            });
        }
    };

    const handleMaterialToggle = (material) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.includes(material)
                ? prev.materials.filter(m => m !== material)
                : [...prev.materials, material]
        }));
         // Clear material errors if any exist
        if (fieldErrors.materials) {
            setFieldErrors(prev => ({ ...prev, materials: null }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.slice(0, 5 - images.length);
        setImages(prev => [...prev, ...newImages]);
         // Clear image errors if any exist
        if (fieldErrors.images) {
            setFieldErrors(prev => ({ ...prev, images: null }));
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // --- Validation logic combined for steps and final submit ---
    const validateStep = (stepToValidate) => {
        let errors = {};
        if (stepToValidate >= 1) {
            if (!formData.title.trim()) errors.title = "Title is required.";
            if (!formData.category) errors.category = "Category must be selected.";
            if (!formData.description.trim()) errors.description = "Description is required.";
        }
        if (stepToValidate >= 2) {
             if (!formData.startingBid || isNaN(formData.startingBid) || parseFloat(formData.startingBid) < 0) {
                errors.startingBid = "Starting Bid must be a valid non-negative number.";
            }
             // Optional: Validate reserve price if entered
             if (formData.reservePrice && (isNaN(formData.reservePrice) || parseFloat(formData.reservePrice) < 0)) {
                 errors.reservePrice = "Reserve Price must be a valid non-negative number.";
             }
        }
        // Add more checks for step 3 if needed (e.g., weight, dimensions format)
         if (stepToValidate >= 3) {
             if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) < 0)) {
                 errors.weight = "Weight must be a valid non-negative number.";
             }
         }

        if (stepToValidate >= 4) { // Only check images on the last step or final submit
            if (images.length === 0) errors.images = "At least one image is required.";
        }
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);
        setFieldErrors({}); // Clear previous errors

        // --- FINAL VALIDATION before submit ---
        const finalErrors = validateStep(4); // Validate all steps
        if (Object.keys(finalErrors).length > 0) {
            setFieldErrors(finalErrors);
             // Try to navigate to the first step with an error
            if (finalErrors.title || finalErrors.category || finalErrors.description) setCurrentStep(1);
            else if (finalErrors.startingBid || finalErrors.reservePrice) setCurrentStep(2);
            else if (finalErrors.weight) setCurrentStep(3) // Example check for step 3
            else if (finalErrors.images) setCurrentStep(4);
            return; // Stop submission
        }
        // --- End Final Validation ---

        setIsLoading(true); // Start loading indicator *after* validation passes

        const data = new FormData();
        // Append form data (same as before)
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('startingBid', formData.startingBid);
        data.append('auctionDuration', formData.auctionDuration);
        data.append('condition', formData.condition);
        data.append('certificates', formData.certificates);
        if (formData.reservePrice) data.append('reservePrice', formData.reservePrice);
        if (formData.era) data.append('era', formData.era);
        if (formData.weight) data.append('weight', formData.weight);
        if (formData.dimensions) data.append('dimensions', formData.dimensions);
        if (formData.shippingInfo) data.append('shippingInfo', formData.shippingInfo);
        formData.materials.forEach(material => data.append('materials', material));
        images.forEach(imageFile => data.append('images', imageFile));

        const token = localStorage.getItem("token");
        // No need for !token check here because useEffect already handles it

        try {
            const response = await fetch("https://localhost:7019/api/listings/create", {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); // Default to empty object

                // Handle Backend Validation Errors (400)
                if (response.status === 400 && errorData.errors) {
                    const backendFieldErrors = {};
                    for (const key in errorData.errors) {
                        if (errorData.errors[key] && errorData.errors[key].length > 0) {
                            const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
                            backendFieldErrors[fieldName] = errorData.errors[key][0];
                        }
                    }
                    setFieldErrors(backendFieldErrors);
                    // Navigate based on backend errors
                    if (backendFieldErrors.title || backendFieldErrors.category || backendFieldErrors.description) setCurrentStep(1);
                    else if (backendFieldErrors.startingBid || backendFieldErrors.reservePrice) setCurrentStep(2);
                    else if (backendFieldErrors.weight) setCurrentStep(3);
                    else if (backendFieldErrors.images) setCurrentStep(4);

                    throw new Error("Please fix the validation errors shown below.");
                }
                // Handle Auth errors
                else if (response.status === 401) {
                    throw new Error("Your session has expired. Please log in again.");
                } else if (response.status === 403) {
                    throw new Error("You are not authorized (Sellers only).");
                }
                // Handle other errors (like 500 Internal Server Error)
                else {
                    const errorMessage = errorData?.detail || errorData?.message || errorData?.title || `Error ${response.status}: Failed to create listing.`;
                    throw new Error(errorMessage);
                }
            }

            // const createdItem = await response.json(); // Only if backend returns the item
            alert('Listing created successfully!');
            navigate('/seller-dashboard');

        } catch (err) {
            console.error("Submit Error:", err);
            setApiError(err.message); // Show the general error message
            // Redirect to login for auth errors after showing message
            if (err.message.includes("expired") || err.message.includes("authorized")) {
                setTimeout(() => navigate('/login'), 3000); // Give user time to read error
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Validate current step before proceeding
    const nextStep = () => {
        const errors = validateStep(currentStep); // Validate only the current step
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors); // Show errors for the current step
        } else {
            setFieldErrors({}); // Clear errors if step is valid
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    // Clear errors when going back
    const prevStep = () => {
        setFieldErrors({});
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // --- RENDER STEPS: Include error display below inputs ---

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
                    // Add error class conditionally
                    className={fieldErrors.title ? 'input-error' : ''}
                />
                {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
            </div>

            <div className="form-group">
                <label>Category *</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className={fieldErrors.category ? 'input-error' : ''}
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => ( <option key={cat} value={cat}>{cat}</option> ))}
                </select>
                {fieldErrors.category && <p className="field-error">{fieldErrors.category}</p>}
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
                    className={fieldErrors.description ? 'input-error' : ''}
                />
                {fieldErrors.description && <p className="field-error">{fieldErrors.description}</p>}
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
                        className={fieldErrors.startingBid ? 'input-error' : ''}
                    />
                    {fieldErrors.startingBid && <p className="field-error">{fieldErrors.startingBid}</p>}
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
                         className={fieldErrors.reservePrice ? 'input-error' : ''}
                    />
                     {fieldErrors.reservePrice && <p className="field-error">{fieldErrors.reservePrice}</p>}
                </div>
            </div>
            <div className="form-group">
                <label>Auction Duration *</label>
                <select
                    name="auctionDuration"
                    value={formData.auctionDuration}
                    onChange={handleInputChange}
                    required
                    // No error class needed if it has a default and can't be empty
                >
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                </select>
                 {fieldErrors.auctionDuration && <p className="field-error">{fieldErrors.auctionDuration}</p>}
            </div>
        </div>
    );

     const renderStep3 = () => (
        <div className="form-step">
            <h3>Item Details & Specifications</h3>
            <div className="form-group">
                <label>Materials & Gemstones</label>
                <div className={`materials-grid ${fieldErrors.materials ? 'input-error-group' : ''}`}>
                    {materials.map(material => (
                        <label key={material} className="material-checkbox">
                           <input
                                type="checkbox"
                                checked={formData.materials.includes(material)}
                                onChange={() => handleMaterialToggle(material)}
                            />
                            <span className="checkmark"></span> {material}
                        </label>
                    ))}
                </div>
                 {fieldErrors.materials && <p className="field-error">{fieldErrors.materials}</p>}
            </div>
            {/* ... other fields for Step 3 ... */}
             <div className="form-row">
                <div className="form-group">
                    <label>Era / Period</label>
                    <select name="era" value={formData.era} onChange={handleInputChange} className={fieldErrors.era ? 'input-error' : ''}>
                       <option value="">Select Era</option>
                       {eras.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                    {fieldErrors.era && <p className="field-error">{fieldErrors.era}</p>}
                </div>
                <div className="form-group">
                    <label>Condition</label>
                    <select name="condition" value={formData.condition} onChange={handleInputChange} className={fieldErrors.condition ? 'input-error' : ''}>
                       {conditions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    {fieldErrors.condition && <p className="field-error">{fieldErrors.condition}</p>}
                </div>
            </div>
             <div className="form-row">
                 <div className="form-group">
                    <label>Weight (grams)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="0.00" step="0.01" className={fieldErrors.weight ? 'input-error' : ''} />
                    {fieldErrors.weight && <p className="field-error">{fieldErrors.weight}</p>}
                </div>
                <div className="form-group">
                    <label>Dimensions</label>
                    <input type="text" name="dimensions" value={formData.dimensions} onChange={handleInputChange} placeholder="e.g., 45cm length" className={fieldErrors.dimensions ? 'input-error' : ''}/>
                    {fieldErrors.dimensions && <p className="field-error">{fieldErrors.dimensions}</p>}
                </div>
            </div>
             <div className="form-group">
                <label className="checkbox-label">
                    <input type="checkbox" name="certificates" checked={formData.certificates} onChange={handleInputChange} />
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
                <label>Upload Images * (Max 5)</label>
                 {fieldErrors.images && <p className="field-error">{fieldErrors.images}</p>}
                <div className={`image-upload-area ${fieldErrors.images ? 'input-error-group' : ''}`}>
                   <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="image-input"
                        disabled={images.length >= 5}
                    />
                   <div className="upload-placeholder">
                       <div className="upload-icon">📷</div>
                       <p>Click or drag to upload</p>
                       <small>Max {5 - images.length} images remaining</small>
                   </div>
                </div>
                <div className="image-preview-grid">
                    {images.map((image, index) => (
                        <div key={index} className="image-preview">
                            <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                            <button type="button" className="remove-image" onClick={() => removeImage(index)} title="Remove image">×</button>
                        </div>
                    ))}
                </div>
            </div>
             <div className="form-group">
                <label>Shipping Information</label>
                <textarea name="shippingInfo" value={formData.shippingInfo} onChange={handleInputChange} placeholder="Describe shipping options, costs..." rows="3" className={fieldErrors.shippingInfo ? 'input-error' : ''}/>
                {fieldErrors.shippingInfo && <p className="field-error">{fieldErrors.shippingInfo}</p>}
            </div>
             <div className="form-group">
                 <label className="checkbox-label">
                     <input type="checkbox" required name="termsConfirmation"/> {/* Give it a name if needed */}
                     <span className="checkmark"></span>
                     I confirm that this listing complies...
                 </label>
                 {/* Consider adding a fieldError for this if backend requires it */}
            </div>
        </div>
    );

    // --- Main Return JSX ---
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
                             <span className="step-label">{['Basic Info', 'Pricing', 'Details', 'Images'][step - 1]}</span>
                         </div>
                     ))}
                 </div>
                 <div className="progress-line"><div className="progress-fill" style={{ width: `${(currentStep - 1) / 3 * 100}%` }}></div></div>
             </div>

            <form onSubmit={handleSubmit} className="listing-form" noValidate> {/* Disable default browser validation */}
                {/* --- Display General API Error --- */}
                {apiError && Object.keys(fieldErrors).length === 0 && (
                    <div className="form-error">
                        <strong>Error:</strong> {apiError}
                    </div>
                )}

                {/* Step Content */}
                <div className="form-content">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                </div>

                {/* Navigation Buttons */}
                <div className="form-navigation">
                     {currentStep > 1 && ( <button type="button" className="btn-secondary" onClick={prevStep} disabled={isLoading}> ← Previous </button> )}
                     <div className="nav-right">
                         {currentStep < 4 ? ( <button type="button" className="btn-primary" onClick={nextStep}> Next Step → </button> )
                                          : ( <button type="submit" className="btn-submit" disabled={isLoading}> {isLoading ? 'Submitting...' : '🎯 Create Listing'} </button> )}
                     </div>
                </div>
            </form>

            {/* Quick Tips */}
             <div className="quick-tips">
                 <h3>💡 Listing Tips</h3>
                 <ul>
                    <li>Use high-quality photos</li>
                    <li>Provide detailed descriptions</li>
                    <li>Research competitive starting bids</li>
                    <li>Be transparent about condition</li>
                 </ul>
             </div>
        </div>
    );
};

export default CreateListing;