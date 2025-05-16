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

  // Change the outermost background and card header/footer for a clean, minimal look:

return (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{
      minHeight: "100vh",
      width: "100vw",
      background: "#f8fafc", // Soft gray/white background, no yellow
      margin: 0,
    }}
  >
    <div
      className="shadow-lg border-0"
      style={{
        width: "100%",
        maxWidth: "370px",
        borderRadius: "20px",
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 6px 32px #e0e0e055",
      }}
    >
      {/* Logo & Title */}
      <div
        className="text-center"
        style={{
          background: "#fff",
          padding: "30px 20px 18px 20px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center mb-2"
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "#f8fafc",
            boxShadow: "0 2px 8px #e0e0e055",
          }}
        >
          <img
            src={require("../../assets/logo.png")}
            alt="YatraNow Logo"
            style={{
              height: "38px",
              filter: "drop-shadow(0 2px 8px #ffe06644)",
            }}
          />
        </div>
        <h2
          className="fw-bold mt-2 mb-0"
          style={{ color: "#b8860b", letterSpacing: 1, fontSize: 24 }}
        >
          YatraNow Admin
        </h2>
        <div className="text-muted" style={{ fontSize: 15 }}>
          Sign in to your dashboard
        </div>
      </div>

      {/* Login Form */}
      <div className="p-4" style={{ background: "#fff" }}>
        <h4 className="text-center mb-4 text-dark fw-bold" style={{ letterSpacing: 0.5 }}>
          Login
        </h4>
        {errors.general && (
          <div className="alert alert-danger py-2" role="alert" style={{ fontSize: 14 }}>
            {errors.general}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold" style={{ color: "#b8860b" }}>
              Username
            </label>
            <input
              type="text"
              className={`form-control border-warning ${errors.username ? "is-invalid" : ""}`}
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              style={{ background: "#f8fafc" }}
              autoFocus
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold" style={{ color: "#b8860b" }}>
              Password
            </label>
            <input
              type="password"
              className={`form-control border-warning ${errors.password ? "is-invalid" : ""}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={{ background: "#f8fafc" }}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <div className="text-end mb-3">
            <Link to="/forgot-password" className="text-primary" style={{ fontSize: 14 }}>
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-warning w-100 text-dark fw-bold"
            style={{
              background: "#ffc107",
              borderRadius: 8,
              fontSize: "1.08rem",
              boxShadow: "0 2px 8px #ffe06633",
              letterSpacing: 0.5,
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
              "Login"
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div
        className="text-center"
        style={{
          background: "#fff",
          padding: "13px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <span className="text-muted" style={{ fontSize: 13 }}>
          &copy; {new Date().getFullYear()} YatraNow &mdash; Welcome!
        </span>
      </div>
    </div>
  </div>
);

};

export default Login;