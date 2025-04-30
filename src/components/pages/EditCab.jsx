import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../layout/Layout";

const EditCab = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Access the passed state
  const cabData = state?.cab; // Get the cab data from state
  const [suggestions, setSuggestions] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalMessage, setModalMessage] = useState(""); // Message to display in the modal
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  const [formData, setFormData] = useState({
    registrationId: cabData?.registrationId || 0,
    ownerName: cabData?.ownerName || "",
    driverName: cabData?.driverName || "",
    driverContact: cabData?.driverContact || "",
    driverLicense: cabData?.driverLicense || "",
    address: cabData?.address || "",
    latitude: cabData?.latitude || "",
    longitude: cabData?.longitude || "",
    perKmRate: cabData?.perKmRate || 0,
    baseFare: cabData?.baseFare || 0,
    status: cabData?.status || "",
    cab: {
      cabId: cabData?.cab?.cabId || 0,
      cabName: cabData?.cab?.cabName || "",
      cabType: cabData?.cab?.cabType || "",
      cabNumber: cabData?.cab?.cabNumber || "",
      cabModel: cabData?.cab?.cabModel || "",
      cabColor: cabData?.cab?.cabColor || "",
      cabInsurance: cabData?.cab?.cabInsurance || "",
      cabCapacity: cabData?.cab?.cabCapacity || "",
      cabImageUrl: cabData?.cab?.cabImageUrl || "",
      cabCity: cabData?.cab?.cabCity || "",
      cabState: cabData?.cab?.cabState || "",
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type === "number") {
        if (name === "perKmRate" && value.length > 2) return; // Restrict to 2 digits
        if (name === "baseFare" && value.length > 5) return; // Restrict to 4 digits
      }
    if (name.startsWith("cab.")) {
      const cabField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        cab: { ...prev.cab, [cabField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "address") {
        fetchAddressSuggestions(value, setSuggestions); // Pass setSuggestions here
    }
  };

  const fetchAddressSuggestions = (query, setSuggestions) => {
    if (!query.trim()) {
      setSuggestions([]); // Clear suggestions if query is empty
      return;
    }
  
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API is not loaded.");
      return;
    }
  
    const autocompleteService = new window.google.maps.places.AutocompleteService();
  
    autocompleteService.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country: ["in", "np"] }, // Restrict to India (in) and Nepal (np)
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.map((prediction) => prediction.description));
        } else {
          console.error("Error fetching predictions:", status);
          setSuggestions([]); // Clear suggestions on error
        }
      }
    );
  };
  const handleAddressSelect = (selectedAddress) => {
    setFormData((prev) => ({ ...prev, address: selectedAddress }));
    setSuggestions([]); // Clear suggestions
  
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API is not loaded.");
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
  
    geocoder.geocode({ address: selectedAddress }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        setFormData((prev) => ({
          ...prev,
          latitude: location.lat(),
          longitude: location.lng(),
        }));
      } else {
        console.error("Error fetching geocode:", status);
      }
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(false); // Ensure uploading state is reset
    setMessage("");

    // Show image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result); // Set the image preview
    };
    reader.readAsDataURL(file);

    try {
      // Compress the image
      const compressedImage = await compressImage(file);

      // Convert compressed image to Base64
      const base64Image = await new Promise((resolve, reject) => {
        const readerForUpload = new FileReader();
        readerForUpload.onloadend = () => {
          resolve(readerForUpload.result.split(",")[1]); // Get Base64 string without the prefix
        };
        readerForUpload.onerror = reject;
        readerForUpload.readAsDataURL(compressedImage);
      });

      console.log("Compressed Base64 Image:", base64Image); // Log the Base64 string for debugging

      // Call API to upload the image
      const response = await fetch("https://commonservice.onrender.com/api/common/uploadBase64Image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "4", // Replace with the actual user ID
          base64Image: base64Image,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.responseCode === 200) {
        const imageUrl = data.responseData; // Extract imageUrl from responseData
        console.log("Image URL:", imageUrl); // Log the image URL for debugging

        // Update the cabImageUrl field in formData
        setFormData((prev) => ({
          ...prev,
          cab: { ...prev.cab, cabImageUrl: imageUrl },
        }));

        setMessage("Image uploaded successfully!");
      } else {
        setMessage(`Failed to upload image: ${data.responseMessage || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("An error occurred while uploading the image.");
    } finally {
      setImageUploading(false);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set the desired width and height for compression
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert the canvas to a Blob
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg", // Output format
            0.7 // Compression quality (0.1 to 1.0)
          );
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required.";
    } else if (formData.ownerName.length < 3) {
      newErrors.ownerName = "Owner name must be at least 3 characters long."; 
    } else if (!/^[a-zA-Z\s]+$/.test(formData.ownerName)) {
      newErrors.ownerName = "Owner name must contain only letters and spaces."; 
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }
    if ((!formData.perKmRate || formData.perKmRate <= 0) && formData.perKmRate !== "" && formData.perKmRate <= 100) {
      newErrors.perKmRate = "Per Km Rate must be in between 1 - 100.";
    }
    if ((!formData.baseFare || formData.baseFare <= 0)) {
      newErrors.baseFare = "Base Fare must be greater than 0.";
    }
    if (!formData.cab.cabName.trim()) {
      newErrors.cabName = "Cab name is required.";
    }
    if (!formData.cab.cabType.trim()) {
      newErrors.cabType = "Cab type is required.";
    }
    if (!formData.cab.cabInsurance.trim()) {
      newErrors.cabInsurance = "Cab insurance is required."; 
    }
    if (!formData.cab.cabNumber.trim()) {
      newErrors.cabNumber = "Cab number is required.";
    }
    if (!formData.cab.cabModel.trim()) {
      newErrors.cabModel = "Cab model is required.";
    }
    if (!formData.cab.cabColor.trim()) {
      newErrors.cabColor = "Cab color is required.";
    }
    if (!formData.cab.cabCapacity && formData.cab.cabCapacity <= 100) {
      newErrors.cabCapacity = "Cab capacity must be greater than 0.";
    }
    if (!formData.cab.cabCity.trim()) {
      newErrors.cabCity = "Cab city is required.";
    }
    if (!formData.cab.cabState.trim()) {
      newErrors.cabState = "Cab state is required.";
    }
    if (!formData.cab.cabImageUrl.trim()) {
      newErrors.cabImageUpload = "Cab image is required. Please upload an image.";
    }
    if (!formData.perKmRate || formData.perKmRate <= 0 || formData.perKmRate > 100) {
        newErrors.perKmRate = "Per Km Rate must be between 1 and 100.";
    }
    
    if (!formData.baseFare || formData.baseFare <= 0) {
    newErrors.baseFare = "Base Fare must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        return; // Stop submission if validation fails
      }
  
    const formDataToSend = new FormData();
    formDataToSend.append("registrationId", formData.registrationId);
    formDataToSend.append("ownerName", formData.ownerName);
    formDataToSend.append("driverName", formData.driverName);
    formDataToSend.append("driverContact", formData.driverContact);
    formDataToSend.append("driverLicense", formData.driverLicense);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("latitude", formData.latitude);
    formDataToSend.append("longitude", formData.longitude);
    formDataToSend.append("perKmRate", formData.perKmRate);
    formDataToSend.append("baseFare", formData.baseFare);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("cabId", formData.cab.cabId);
    formDataToSend.append("cabName", formData.cab.cabName);
    formDataToSend.append("cabType", formData.cab.cabType);
    formDataToSend.append("cabNumber", formData.cab.cabNumber);
    formDataToSend.append("cabModel", formData.cab.cabModel);
    formDataToSend.append("cabColor", formData.cab.cabColor);
    formDataToSend.append("cabInsurance", formData.cab.cabInsurance);
    formDataToSend.append("cabCapacity", formData.cab.cabCapacity);
    formDataToSend.append("cabCity", formData.cab.cabCity);
    formDataToSend.append("cabState", formData.cab.cabState);
  
    if (formData.cab.cabImageUrl instanceof File) {
      formDataToSend.append("cabImage", formData.cab.cabImageUrl);
    }
  
    try {
      const response = await fetch(
        `https://carbookingservice.onrender.com/api/cab/registration/update/${formData.registrationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // No need to set Content-Type
        }
      );
  
      const data = await response.json();
  
      if (response.ok && data.responseCode === 200) {
        setModalMessage("Cab updated successfully!");
        setIsModalVisible(true); // Show success modal
      } else {
        setModalMessage(`Failed to update cab: ${data.responseMessage}`);
        setIsModalVisible(true); // Show error modal
      }
    } catch (err) {
      console.error("Error updating cab:", err);
      setModalMessage("An error occurred while updating the cab. Please try again.");
      setIsModalVisible(true); // Show error modal
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h1 className="mb-4">Edit Cab Details</h1>
        <form onSubmit={handleSubmit}>
          {/* Owner and Driver Details */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-person-fill me-2"></i> Owner and Driver Details
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="ownerName" className="form-label">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.ownerName ? "is-invalid" : ""}`}
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    maxLength={50}
                  />
                  {errors.ownerName && <div className="invalid-feedback">{errors.ownerName}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="driverName" className="form-label">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.driverName ? "is-invalid" : ""}`}
                    id="driverName"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    maxLength={50}
                  />
                  {errors.driverName && <div className="invalid-feedback">{errors.driverName}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="driverContact" className="form-label">
                    Driver Contact
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.driverContact ? "is-invalid" : ""}`}
                    id="driverContact"
                    name="driverContact"
                    value={formData.driverContact}
                    onChange={handleChange}
                    maxLength={12}
                  />
                  {errors.driverContact && <div className="invalid-feedback">{errors.driverContact}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="driverLicense" className="form-label">
                    Driver License
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.driverLicense ? "is-invalid" : ""}`}
                    id="driverLicense"
                    name="driverLicense"
                    value={formData.driverLicense}
                    onChange={handleChange}
                    maxLength={30}
                  />
                  {errors.driverLicense && <div className="invalid-feedback">{errors.driverLicense}</div>}
                </div>
                <div className="col-md-12 mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  {/* Address Suggestions */}
                    {suggestions.length > 0 && (
                    <ul className="list-group mt-2">
                        {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleAddressSelect(suggestion)}
                            style={{ cursor: "pointer" }}
                        >
                            {suggestion}
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Cab Details */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-car-front-fill me-2"></i> Cab Details
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="cab.cabName" className="form-label">
                    Cab Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.cabName ? "is-invalid" : ""}`}
                    id="cab.cabName"
                    name="cab.cabName"
                    value={formData.cab.cabName}
                    onChange={handleChange}
                    maxLength={30}
                  />
                  {errors.cabName && <div className="invalid-feedback">{errors.cabName}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="cab.cabNumber" className="form-label">
                    Cab Number
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.cabNumber ? "is-invalid" : ""}`}
                    id="cab.cabNumber"
                    name="cab.cabNumber"
                    value={formData.cab.cabNumber}
                    onChange={handleChange}
                    maxLength={12}
                  />
                  {errors.cabNumber && <div className="invalid-feedback">{errors.cabNumber}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="cab.cabType" className="form-label">
                    Cab Type
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.cabType ? "is-invalid" : ""}`}
                    id="cab.cabType"
                    name="cab.cabType"
                    value={formData.cab.cabType}
                    onChange={handleChange}
                    maxLength={30}
                  />
                  {errors.cabType && <div className="invalid-feedback">{errors.cabType}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="cab.cabModel" className="form-label">
                    Cab Model
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.cabModel ? "is-invalid" : ""}`}
                    id="cab.cabModel"
                    name="cab.cabModel"
                    value={formData.cab.cabModel}
                    onChange={handleChange}
                    maxLength={10}
                  />
                  {errors.cabModel && <div className="invalid-feedback">{errors.cabModel}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="cab.cabColor" className="form-label">
                    Cab Color
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.cabColor ? "is-invalid" : ""}`}
                    id="cab.cabColor"
                    name="cab.cabColor"
                    value={formData.cab.cabColor}
                    onChange={handleChange}
                    maxLength={30}
                  />
                  {errors.cabColor && <div className="invalid-feedback">{errors.cabColor}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="cab.cabCapacity" className="form-label">
                    Cab Capacity
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.cabCapacity ? "is-invalid" : ""}`}
                    id="cab.cabCapacity"
                    name="cab.cabCapacity"
                    value={formData.cab.cabCapacity}
                    onChange={handleChange}
                    maxLength={3}
                  />
                  {errors.cabCapacity && <div className="invalid-feedback">{errors.cabCapacity}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="cab.cabState" className="form-label">
                    Cab State
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.cabState ? "is-invalid" : ""}`}
                    id="cab.cabState"
                    name="cab.cabState"
                    value={formData.cab.cabState}
                    onChange={handleChange}
                    maxLength={30}
                  />
                  {errors.cabState && <div className="invalid-feedback">{errors.cabState}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="cab.cabCity" className="form-label">
                    Cab city
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.cabCity ? "is-invalid" : ""}`}
                    id="cab.cabCity"
                    name="cab.cabCity"
                    value={formData.cab.cabCity}
                    onChange={handleChange}
                    maxLength={50}
                  />
                  {errors.cabCity && <div className="invalid-feedback">{errors.cabCity}</div>}
                </div>
                <div className="col-md-12 mb-3">
                  <label htmlFor="cabImage" className="form-label">
                    Cab Image
                  </label>
                  <div className="mb-3">
                    <img
                      src={newImage || formData.cab.cabImageUrl}
                      alt="Cab"
                      className="img-thumbnail"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </div>
                  <input
                    type="file"
                    className={`form-control ${errors.cabImage ? "is-invalid" : ""}`}
                    id="cabImage"
                    name="cabImage"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {errors.cabImage && <div className="invalid-feedback">{errors.cabImage}</div>}
                  {imageUploading && (
                    <div className="mt-2">
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>{" "}
                      Uploading...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-info-circle-fill me-2"></i> Additional Details
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="perKmRate" className="form-label">
                    Per Km Rate
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.perKmRate ? "is-invalid" : ""}`}
                    id="perKmRate"
                    name="perKmRate"
                    value={formData.perKmRate}
                    onChange={handleChange}
                    
                  />
                  {errors.perKmRate && <div className="invalid-feedback">{errors.perKmRate}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="baseFare" className="form-label">
                    Base Fare
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.baseFare ? "is-invalid" : ""}`}
                    id="baseFare"
                    name="baseFare"
                    value={formData.baseFare}
                    onChange={handleChange}
                    
                  />
                  {errors.baseFare && <div className="invalid-feedback">{errors.baseFare}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    className={`form-control ${errors.status ? "is-invalid" : ""}`}
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    
                  >
                    {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary me-2">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/show-cabs")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {/* Modal for displaying messages */}
      {isModalVisible && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Message</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setIsModalVisible(false);
                    if (modalMessage === "Cab updated successfully!") {
                      navigate("/show-cabs");
                    }
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditCab;