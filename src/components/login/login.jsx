import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

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
  
    // Validate form data
    if (!formData.username.trim() || !formData.password.trim()) {
      setErrors({ general: "Username and password are required." });
      setLoading(false);
      return;
    }
  
    // SHA-1 encode the password
    const hashedPassword = CryptoJS.SHA1(formData.password).toString();
  
    // Prepare the request payload
    const requestData = {
      username: formData.username,
      password: hashedPassword, // Send the hashed password
    };
  
    try {
      const response = await fetch("https://userservice-a0nr.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
  
        if (responseData.responseMessage === "success") {
          const userData = responseData.responseData[0]; // Extract user data from the array
          const { token, userId, name, email, phone, role, imageUrl } = userData;
  
          // Save the token and user details in localStorage
          localStorage.setItem("authToken", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("name", name);
          localStorage.setItem("email", email);
          localStorage.setItem("phone", phone);
          localStorage.setItem("role", role);
          localStorage.setItem("imageUrl", imageUrl);
  
          // Redirect to the dashboard or index page
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
      className="d-flex justify-content-center align-items-center bg-dark text-white"
      style={{ height: "100vh" }}
    >
      <div className="card shadow-lg" style={{ width: "400px" }}>
        <div className="card-header bg-primary text-white text-center">
          <h4>Login</h4>
        </div>
        <div className="card-body">
          {errors.general && (
            <div className="alert alert-danger" role="alert">
              {errors.general}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
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
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
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
              <a href="/forgot-password" className="text-primary">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
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
        <div className="card-footer text-center">
          <small>
            Don't have an account? <a href="/register-admin">Register</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;