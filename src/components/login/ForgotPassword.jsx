import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js"; // Import crypto-js for password encryption
import API_ENDPOINTS from "../config/apiConfig";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain", // Set Content-Type to text/plain
        },
        body: email, // Send email as a plain string
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse the response
        if (responseData.responseMessage === "success") {
          setMessage("OTP sent to your email.");
          setStep(2); // Move to Step 2
        } else {
          setMessage(responseData.responseMessage || "Failed to send OTP.");
        }
      } else {
        const errorData = await response.json();
        setMessage(errorData.responseMessage || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while sending the OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Encrypt the new password using SHA-1
    const encryptedPassword = CryptoJS.SHA1(newPassword).toString();

    try {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, otp, newPassword: encryptedPassword }), // Include username in the request body
      });

      if (response.ok) {
        setMessage("Password updated successfully.");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
      } else {
        const errorData = await response.json();
        setMessage(errorData.responseMessage || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while resetting the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        backgroundColor: "#f8f9fa", // Light background
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "400px",
          borderRadius: "10px",
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
              height: "40px", // Increased size for better visibility
              marginBottom: "10px",
            }}
          />
        </div>

        {/* Form Section */}
        <div className="card-body">
          <h4 className="text-center mb-4 text-dark">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h4>
          {message && (
            <div
              className={`alert ${
                message.includes("successfully") || message.includes("sent")
                  ? "alert-success"
                  : "alert-danger"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-dark">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
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
                  "Send OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpAndResetPassword}>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label text-dark">
                  OTP
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label text-dark">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label text-dark">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
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
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;