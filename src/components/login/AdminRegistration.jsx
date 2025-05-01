import React, { useState } from "react";
import CryptoJS from "crypto-js"; // Import crypto-js for SHA-1 encoding
import { Link } from "react-router-dom"; // Import Link for navigation

const AdminRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "ADMIN", // Default role as Admin
    verified: true,
    imageUrl: "http://res.cloudinary.com/djapc6r8k/image/upload/v1745910457/qm1svq9udbwuuze0aewn.avif",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); // Track registration status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate form data
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // SHA-1 encode the password
    const hashedPassword = CryptoJS.SHA1(formData.password).toString();

    // Prepare the data to send
    const dataToSend = {
      ...formData,
      password: hashedPassword,
    };

    try {
      const response = await fetch("https://userservice-a0nr.onrender.com/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse the response data
        const adminData = responseData.responseData[0]; // Extract the first admin object
        setMessage(`Admin registered successfully! ID: ${adminData.id}`);
        setIsRegistered(true); // Set registration status to true
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "Admin",
          verified: true,
          imageUrl: "http://res.cloudinary.com/djapc6r8k/image/upload/v1745910457/qm1svq9udbwuuze0aewn.avif",
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.responseMessage || "Failed to register admin.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while registering the admin.");
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
              height: "50px", // Increased size for better visibility
              marginBottom: "10px",
            }}
          />
        </div>

        {/* Registration Form */}
        <div className="card-body">
          <h4 className="text-center mb-4 text-dark">Admin Registration</h4>
          {message && (
            <div
              className={`alert ${
                message.includes("successfully") ? "alert-success" : "alert-danger"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}
          {!isRegistered ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label text-dark">
                  Name
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  maxLength={50} // Limit to 50 characters
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-dark">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  maxLength={50}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label text-dark">
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
              <div className="mb-3">
                <label htmlFor="phone" className="form-label text-dark">
                  Phone
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  maxLength={10} // Limit to 10 characters
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
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
                  "Register"
                )}
              </button>
             
            </form>
          ) : (
            <div className="text-center mt-3">
              <p>Registration successful! You can now log in.</p>
              <Link to="/login" className="btn btn-success">
                Go to Login
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="card-footer text-center"
          style={{
            backgroundColor: "white", // Yellow background
            padding: "15px",
          }}
        >
          <small className="text-dark">
            Already have an account?{" "}
            <Link to="/login" className="text-dark fw-bold">
              Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;