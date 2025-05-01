import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    imageUrl: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("view");
  const [uploading, setUploading] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name") || "";
    const email = localStorage.getItem("email") || "";
    const phone = localStorage.getItem("phone") || "";
    const imageUrl = localStorage.getItem("imageUrl") || "";
    const role = localStorage.getItem("role");
    setFormData({ id: userId, name, email, phone, imageUrl, role });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);

      // Show the image preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          imageUrl: reader.result, // Set the preview image as a Base64 string
        }));
      };
      reader.readAsDataURL(file);

      try {
        const base64Image = await compressAndConvertToBase64(file);

        const response = await fetch("https://commonservice.onrender.com/api/common/uploadBase64Image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: localStorage.getItem("userId"), base64Image }),
        });

        const data = await response.json();
        if (response.ok && data.responseData) {
          const imageUrl = data.responseData;
          setFormData((prevFormData) => ({
            ...prevFormData,
            imageUrl: imageUrl,
          }));
          localStorage.setItem("imageUrl", imageUrl);
        } else {
          console.error("Failed to generate image URL");
        }
      } catch (error) {
        console.error("Error processing image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const compressAndConvertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const maxWidth = 300;
          const maxHeight = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const base64Image = canvas.toDataURL("image/jpeg", 0.8);
          resolve(base64Image);
        };

        img.onerror = (error) => reject(error);
        img.src = event.target.result;
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://userservice-a0nr.onrender.com/api/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (response.ok && responseData.responseMessage === "success") {
        setMessage("Profile updated successfully.");
        localStorage.setItem("name", formData.name);
        localStorage.setItem("email", formData.email);
        localStorage.setItem("phone", formData.phone);
        localStorage.setItem("imageUrl", formData.imageUrl);
        setActiveTab("view");
      } else {
        setMessage(responseData.responseMessage || "Failed to update profile.");
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
                className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"} alert-dismissible fade show`}
                role="alert"
              >
                {message}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setMessage("")} // Clear the message when the alert is closed
                ></button>
              </div>
            )}

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
              <div className="text-center">
                <img
                  src={formData.imageUrl || "https://via.placeholder.com/120"}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <h5>{formData.name}</h5>
                <p className="text-muted mb-1">{formData.email}</p>
                <p className="text-muted">{formData.phone}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <div className="col-12 text-center">
                    <h5 className="fw-bold mb-3">Profile Image</h5>
                    <div className="d-flex flex-column align-items-center">
                      <input
                        type="file"
                        className="form-control form-control-sm mb-2"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {uploading ? (
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Uploading...</span>
                        </div>
                      ) : (
                        <img
                          src={formData.imageUrl || "https://via.placeholder.com/120"}
                          alt="Profile"
                          className="rounded-circle mb-3"
                          style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        />
                      )}
                    </div>
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
                      maxLength={50}
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
                      maxLength={40}
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
                      maxLength={10}
                    />
                  </div>
                </div>

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