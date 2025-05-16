import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import API_ENDPOINTS from "../config/apiConfig";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
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
          "Content-Type": "text/plain",
        },
        body: email,
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.responseMessage === "success") {
          setMessage("OTP sent to your email.");
          setStep(2);
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

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    const encryptedPassword = CryptoJS.SHA1(newPassword).toString();

    try {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, otp, newPassword: encryptedPassword }),
      });

      if (response.ok) {
        setMessage("Password updated successfully.");
        setTimeout(() => navigate("/login"), 2000);
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
        minHeight: "100vh",
        width: "100vw",
        background: "#f8fafc",
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
            {step === 1 ? "Forgot your password?" : "Reset your password"}
          </div>
        </div>

        {/* Form Section */}
        <div className="p-4" style={{ background: "#fff" }}>
          <h4 className="text-center mb-4 text-dark fw-bold" style={{ letterSpacing: 0.5 }}>
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h4>
          {message && (
            <div
              className={`alert ${
                message.includes("successfully") || message.includes("sent")
                  ? "alert-success"
                  : "alert-danger"
              } py-2`}
              role="alert"
              style={{ fontSize: 14 }}
            >
              {message}
            </div>
          )}
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold" style={{ color: "#b8860b" }}>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control border-warning"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{ background: "#f8fafc" }}
                />
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
                  "Send OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpAndResetPassword}>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label fw-semibold" style={{ color: "#b8860b" }}>
                  OTP
                </label>
                <input
                  type="text"
                  className="form-control border-warning"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  required
                  style={{ background: "#f8fafc" }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label fw-semibold" style={{ color: "#b8860b" }}>
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control border-warning"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  style={{ background: "#f8fafc" }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold" style={{ color: "#b8860b" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control border-warning"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  style={{ background: "#f8fafc" }}
                />
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
                  "Reset Password"
                )}
              </button>
            </form>
          )}
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

export default ForgotPassword;