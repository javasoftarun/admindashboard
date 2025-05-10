import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { Link, useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../config/apiConfig";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!formData.username.trim() || !formData.password.trim()) {
      setErrors({ general: "Username and password are required." });
      setLoading(false);
      return;
    }

    const hashedPassword = CryptoJS.SHA1(formData.password).toString();

    const requestData = {
      username: formData.username,
      password: hashedPassword,
    };

    try {
      const response = await fetch(
        API_ENDPOINTS.LOGIN_API,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.responseMessage === "success") {
          const userData = responseData.responseData[0];
          const { token, userId, name, email, phone, role, imageUrl } = userData;

          localStorage.setItem("authToken", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("name", name);
          localStorage.setItem("email", email);
          localStorage.setItem("phone", phone);
          localStorage.setItem("role", role);
          localStorage.setItem("imageUrl", imageUrl);

          navigate("/index");
        } else {
          setErrors({ general: responseData.responseMessage || "Login failed." });
        }
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.responseMessage || "Login failed." });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ general: "An error occurred while logging in." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh", // Full height of the viewport
        width: "100vw", // Full width of the viewport
        backgroundColor: "#f8f9fa", // Light background
        margin: 0, // Remove any margin
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "100%", // Full width for mobile
          maxWidth: "400px", // Limit width on larger screens
          height: "auto", // Adjust height based on content
          borderRadius: "10px", // Add slight border radius for better aesthetics
          overflow: "hidden",
        }}
      >
        {/* Logo Section */}
        <div
          className="text-center"
          style={{
            backgroundColor: "#333333", // Dark background for contrast
            padding: "30px 20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
          }}
        >
          <img
            src={require("../../assets/logo.png")} // Adjust the path based on your project structure
            alt="YatraNow Logo"
            style={{
              height: "50px", // Increased size for better visibility
              marginBottom: "10px",
            }}
          />
        </div>

        {/* Login Form */}
        <div className="card-body d-flex flex-column justify-content-center">
          <h4 className="text-center mb-4 text-dark">Login</h4>
          {errors.general && (
            <div className="alert alert-danger" role="alert">
              {errors.general}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label text-dark">
                Username
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-dark">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            <div className="text-end mb-3">
              <Link to="/forgot-password" className="text-primary">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="btn btn-warning w-100 text-dark fw-bold"
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div
          className="card-footer text-center"
          style={{
            backgroundColor: "#333333", // Dark footer for contrast
            padding: "15px",
          }}
        >
          <p className="text-white mb-0">Welcome to YatraNow!</p>
        </div>
      </div>
    </div>
  );
};

export default Login;