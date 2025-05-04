import React, { useState } from "react";
import CryptoJS from "crypto-js"; // Import crypto-js for SHA-1 encoding
import Layout from "../layout/Layout";

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
  const [plainPassword, setPlainPassword] = useState(""); // Store plain password
  const [plainEmail, setPlainEmail] = useState(""); // Store plain email

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

    // Store the plain email and password before hashing
    setPlainEmail(formData.email);
    setPlainPassword(formData.password);

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

        // Reset the form data
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
    <Layout>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          backgroundColor: "#f4f6f9", // Light gray background
        }}
      >
        <div
          className="card shadow-lg border-0"
          style={{
            width: "450px",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            className="card-header text-center text-white"
            style={{
              backgroundColor: "#ffc107", // Yellow header
              padding: "20px",
            }}
          >
            <h4 className="mb-0">Admin Registration</h4>
          </div>
          <div className="card-body p-4">
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
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-bold text-dark">
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
                    maxLength={50}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-bold text-dark">
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
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold text-dark">
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
                <div className="mb-4">
                  <label htmlFor="phone" className="form-label fw-bold text-dark">
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
                    maxLength={10}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <button
                  type="submit"
                  className="btn btn-warning w-100 fw-bold text-dark"
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
              <div className="text-center mt-4">
                <p className="text-success fw-bold">Registration successful!</p>
                <p>
                  <strong className="text-warning">Email:</strong> {plainEmail}
                </p>
                <p>
                  <strong className="text-warning">Password:</strong> {plainPassword}
                </p>
                <p>You can now log in using the above credentials.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminRegistration;