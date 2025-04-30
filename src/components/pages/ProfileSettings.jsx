import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    imageUrl: "https://via.placeholder.com/150", // Default profile image
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("view"); // "view" or "edit"

  // Load user data from localStorage on component mount
  useEffect(() => {
    const name = localStorage.getItem("name") || "";
    const email = localStorage.getItem("email") || "";
    const phone = localStorage.getItem("phone") || "";
    const imageUrl = localStorage.getItem("imageUrl") || "https://via.placeholder.com/150";
    setFormData({ name, email, phone, imageUrl });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Save Changes button clicked");
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://userservice-a0nr.onrender.com/api/users/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.responseMessage === "success") {
          setMessage("Profile updated successfully.");
          localStorage.setItem("name", formData.name);
          localStorage.setItem("email", formData.email);
          localStorage.setItem("phone", formData.phone);
          localStorage.setItem("imageUrl", formData.imageUrl);
          setActiveTab("view");
        } else {
          setMessage(responseData.responseMessage || "Failed to update profile.");
        }
      } else {
        const errorData = await response.json();
        setMessage(errorData.responseMessage || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="card shadow-lg">
          <div className="card-header text-center bg-light">
            <h4 className="fw-bold">Profile Settings</h4>
          </div>
          <div className="card-body">
            {message && (
              <div
                className={`alert ${
                  message.includes("success") ? "alert-success" : "alert-danger"
                } alert-dismissible fade show`}
                role="alert"
              >
                {message}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Tabs for switching between View and Edit modes */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "view" ? "active" : ""}`}
                  onClick={() => setActiveTab("view")}
                >
                  View Profile
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "edit" ? "active" : ""}`}
                  onClick={() => setActiveTab("edit")}
                >
                  Edit Profile
                </button>
              </li>
            </ul>

            {activeTab === "view" ? (
              // View Mode
              <div className="text-center">
                <img
                  src={formData.imageUrl}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <h5>{formData.name}</h5>
                <p className="text-muted mb-1">{formData.email}</p>
                <p className="text-muted">{formData.phone}</p>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-12 text-center">
                    <input
                      type="hidden"
                      className="form-control form-control-sm"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                    />
                    <img
                      src={formData.imageUrl}
                      alt="Profile Preview"
                      className="rounded-circle mt-2"
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label small">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label small">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label small">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="row mt-4">
                  <div className="col-12 d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm px-4"
                      disabled={loading}
                      style={{ borderRadius: "20px" }}
                    >
                      {loading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSettings;