import React, { useState } from "react";
import Layout from "../layout/Layout";
import SHA1 from "crypto-js/sha1";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    notifications: {
      email: true,
      sms: false,
    },
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false); // Separate state for account deletion

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        notifications: {
          ...formData.notifications,
          [name]: checked,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const hashedOldPassword = formData.oldPassword ? SHA1(formData.oldPassword).toString() : "";
      const hashedNewPassword = SHA1(formData.password).toString();
      // Prepare the request body
      const requestBody = {
        userId: localStorage.getItem("userId"), // Retrieve userId from localStorage
        oldPassword: hashedOldPassword, // Use hashed old password
        newPassword: hashedNewPassword, // Use hashed new password
      };

      // Call API to update account settings
      const response = await fetch("https://userservice-a0nr.onrender.com/api/users/update/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.responseMessage === "success") {
          setMessage("Password updated successfully.");
        } else {
          setMessage(responseData.responseMessage || "Failed to update password.");
        }
      } else {
        const errorData = await response.json();
        setMessage(errorData.responseMessage || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while updating the password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      // Call API to delete the account
      const response = await fetch("https://userservice-a0nr.onrender.com/api/users/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMessage("Account deleted successfully.");
        // Redirect to login or home page after deletion
        window.location.href = "/login";
      } else {
        const errorData = await response.json();
        setMessage(errorData.responseMessage || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while deleting the account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="card shadow-lg">
          <div className="card-header text-center bg-light">
            <h4 className="fw-bold">Account Settings</h4>
          </div>
          <div className="card-body">
            {message && (
              <div
                className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"
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

            <form onSubmit={handleSubmit}>
              {/* Security Section */}
              <h5 className="mb-3">Security</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="oldPassword" className="form-label small">
                    Old Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    id="oldPassword"
                    name="oldPassword"
                    value={formData.oldPassword || ""}
                    onChange={handleChange}
                    placeholder="Enter old password"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label small">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label small">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {/* Preferences Section */}
              <h5 className="mb-3">Preferences</h5>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="emailNotifications"
                  name="email"
                  checked={formData.notifications.email}
                  onChange={handleChange}
                />
                <label className="form-check-label small" htmlFor="emailNotifications">
                  Enable Email Notifications
                </label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="smsNotifications"
                  name="sms"
                  checked={formData.notifications.sms}
                  onChange={handleChange}
                />
                <label className="form-check-label small" htmlFor="smsNotifications">
                  Enable SMS Notifications
                </label>
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

            {/* Delete Account Button */}
            <h5 className="mt-4 mb-3">Account Management</h5>
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm px-4"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  style={{ borderRadius: "20px" }}
                >
                  {deleting ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Delete Account"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountSettings;