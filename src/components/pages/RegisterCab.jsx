import React, { useState } from "react";
import Layout from "../layout/Layout";
import API_ENDPOINTS from "../config/apiConfig";

const RegisterCab = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    driverName: "",
    driverContact: "",
    driverLicense: "",
    address: "",
    perKmRate: 0,
    baseFare: 0,
    status: "active",
    cab: {
      cabName: "",
      cabType: "",
      cabNumber: "",
      cabModel: "",
      cabColor: "",
      cabInsurance: "",
      cabCapacity: "",
      cabImageUrl: "",
      cabCity: "",
      cabState: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State to store validation errors
  const [message, setMessage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // For address suggestions
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State to store modal message

  const handleInputChange = (e) => {
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

    // Fetch address suggestions if the field is "address"
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

  const handleImageUpload = async (e) => {
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

      // Call API to upload the image
      const response = await fetch(API_ENDPOINTS.UPLOAD_BASE64_IMAGE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          base64Image: base64Image,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.responseCode === 200) {
        const imageUrl = data.responseData;
        console.log("Image URL:", imageUrl);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_ENDPOINTS.ADD_CAB, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setModalMessage("Cab registered successfully!");
        setModalVisible(true); // Show success modal
        setFormData({
          ownerName: "",
          driverName: "",
          driverContact: "",
          driverLicense: "",
          address: "",
          perKmRate: 0,
          baseFare: 0,
          status: "active",
          cab: {
            cabName: "",
            cabType: "",
            cabNumber: "",
            cabModel: "",
            cabColor: "",
            cabInsurance: "",
            cabCapacity: "",
            cabImageUrl: "",
            cabCity: "",
            cabState: "",
          },
        });
      } else {
        setModalMessage(`Failed to register cab: ${data.responseMessage || "Unknown error"}`);
        setModalVisible(true); // Show failure modal
      }
    } catch (error) {
      console.error("Error registering cab:", error);
      setModalMessage("An error occurred while registering the cab.");
      setModalVisible(true); // Show failure modal
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h1 className="mb-4 fw-bold" style={{ color: "#ffc107" }}>
          <i className="bi bi-taxi-front-fill me-2" style={{ color: "#ffc107" }}></i>
          Register Cab
        </h1>
        {message && (
          <div
            className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"
              }`}
            role="alert"
          >
            {message}
          </div>
        )}
        <div className="card shadow" style={{ borderRadius: 16, border: "1px solid #ffe066" }}>
          <form onSubmit={handleSubmit}>
            {/* Owner and Driver Details */}
            <div className="card mb-4 border-0" style={{ borderRadius: 16 }}>
              <div
                className="card-header"
                style={{
                  background: "#fffbe6",
                  color: "#b8860b",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  borderBottom: "2px solid #ffc107",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                Owner and Driver Details
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      maxLength={10}
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
                      onChange={handleInputChange}
                      maxLength={15}
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
                      onChange={handleInputChange}
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
            <div className="card mb-4 border-0" style={{ borderRadius: 16 }}>
              <div
                className="card-header"
                style={{
                  background: "#fffbe6",
                  color: "#b8860b",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  borderBottom: "2px solid #ffc107",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                Cab Details
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
                      onChange={handleInputChange}
                      maxLength={30}
                    />
                    {errors.cabName && <div className="invalid-feedback">{errors.cabName}</div>}
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
                      onChange={handleInputChange}
                      maxLength={30}
                    />
                    {errors.cabType && <div className="invalid-feedback">{errors.cabType}</div>}
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
                      onChange={handleInputChange}
                      maxLength={12}
                    />
                    {errors.cabNumber && <div className="invalid-feedback">{errors.cabNumber}</div>}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      maxLength={30}
                    />
                    {errors.cabColor && <div className="invalid-feedback">{errors.cabColor}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cab.cabInsurance" className="form-label">
                      Cab Insurance
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.cabInsurance ? "is-invalid" : ""}`}
                      id="cab.cabInsurance"
                      name="cab.cabInsurance"
                      value={formData.cab.cabInsurance}
                      onChange={handleInputChange}
                      maxLength={30}
                    />
                    {errors.cabInsurance && <div className="invalid-feedback">{errors.cabInsurance}</div>}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      maxLength={30}
                    />
                    {errors.cabState && <div className="invalid-feedback">{errors.cabState}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cab.cabCity" className="form-label">
                      Cab City
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.cabCity ? "is-invalid" : ""}`}
                      id="cab.cabCity"
                      name="cab.cabCity"
                      value={formData.cab.cabCity}
                      onChange={handleInputChange}
                      maxLength={50}
                    />
                    {errors.cabCity && <div className="invalid-feedback">{errors.cabCity}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="cabImageUpload" className="form-label">
                      Upload Cab Image
                    </label>
                    <input
                      type="file"
                      className={`form-control ${errors.cabImageUpload ? "is-invalid" : ""}`}
                      id="cabImageUpload"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                    />
                    {errors.cabImageUpload && <div className="invalid-feedback">{errors.cabImageUpload}</div>}
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
                    {imagePreview && (
                      <div className="mt-3">
                        <img
                          src={imagePreview}
                          alt="Cab Preview"
                          className="img-thumbnail"
                          style={{ maxWidth: "100px" }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="cab.cabImageUrl" className="form-label">
                      Cab Image URL
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cab.cabImageUrl"
                      name="cab.cabImageUrl"
                      value={formData.cab.cabImageUrl}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location and Pricing */}
            <div className="card mb-4 border-0" style={{ borderRadius: 16 }}>
              <div
                className="card-header"
                style={{
                  background: "#fffbe6",
                  color: "#b8860b",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  borderBottom: "2px solid #ffc107",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                Location and Pricing
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                    />
                    {errors.baseFare && <div className="invalid-feedback">{errors.baseFare}</div>}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-warning fw-bold text-dark px-4"
              style={{
                background: "#ffc107",
                borderColor: "#ffc107",
                boxShadow: "0 2px 8px #ffe06650",
                borderRadius: 8,
              }}
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Register Cab"
              )}
            </button>
          </form>
        </div>

        {/* Modal */}
        {modalVisible && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Registration Status</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalVisible(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{modalMessage}</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalVisible(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default RegisterCab;