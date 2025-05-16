import React, { useState } from "react";
import CryptoJS from "crypto-js";
import API_ENDPOINTS from "../config/apiConfig";

const AddUserModal = ({ show, onHide, handleAddUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    verified: false,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Encode the password in SHA-1
      const encodedPassword = CryptoJS.SHA1(formData.password).toString();

      // Prepare the request payload
      const payload = {
        ...formData,
        password: encodedPassword,
      };

      // Send the API request
      const response = await fetch(API_ENDPOINTS.ADD_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.responseCode === 200 && data.responseMessage === "success") {
        handleAddUser(data.responseData[0]);
        onHide();
      } else {
        setError(data.responseMessage || "Failed to add user.");
      }
    } catch (err) {
      setError("An error occurred while adding the user.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow-lg" style={{ borderRadius: 16 }}>
          <div className="modal-header" style={{ background: "#fff", borderBottom: "2px solid #ffc107" }}>
            <h5 className="modal-title text-dark fw-bold">
              <i className="bi bi-person-plus me-2" style={{ color: "#ffc107" }}></i>
              Add New User
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body" style={{ background: "#fff" }}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label fw-semibold" style={{ color: "#ffc107" }}>
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control border-warning"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={50}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label fw-semibold" style={{ color: "#ffc107" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control border-warning"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={50}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="password" className="form-label fw-semibold" style={{ color: "#ffc107" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control border-warning"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label fw-semibold" style={{ color: "#ffc107" }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control border-warning"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="role" className="form-label fw-semibold" style={{ color: "#ffc107" }}>
                    Role
                  </label>
                  <select
                    className="form-select border-warning"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="ADMIN">Admin</option>
                    <option value="CABOWNER">Cab Owner</option>
                    <option value="USER">User</option>
                    <option value="MANAGER">Manager</option>
                    <option value="SUPPORT">Support</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="imageUrl" className="form-label fw-semibold" style={{ color: "#ffc107" }}>
                    Image URL
                  </label>
                  <input
                    type="text"
                    className="form-control border-warning"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    maxLength={200}
                  />
                </div>
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input border-warning"
                  id="verified"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  style={{ accentColor: "#ffc107" }}
                />
                <label className="form-check-label fw-semibold" htmlFor="verified" style={{ color: "#ffc107" }}>
                  Verified
                </label>
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-warning text-dark fw-bold me-2" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Adding...
                    </>
                  ) : (
                    "Add User"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                  disabled={loading}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;