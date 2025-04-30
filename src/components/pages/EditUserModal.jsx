import React, { useState } from "react";

const EditUserModal = ({ showModal, setShowModal, selectedUser, setSelectedUser, handleUpdateUser }) => {
  const [success, setSuccess] = useState(false); // State to track success message
  const [error, setError] = useState(""); // State to track error message
  const [loading, setLoading] = useState(false); // State to track loading status

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    setError(""); // Clear any previous error message
    setLoading(true); // Start loading
    const isUpdated = await handleUpdateUser(); // Call the update function
    setLoading(false); // Stop loading
    if (isUpdated) {
      setSuccess(true); // Show success message
      setTimeout(() => {
        setSuccess(false); // Hide success message after 2 seconds
        setShowModal(false); // Close the modal
      }, 2000);
    } else {
      setError("Failed to update user. Please try again."); // Set error message
    }
  };

  if (!showModal) return null; // Don't render the modal if it's not visible

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {success && (
                <div className="alert alert-success d-flex align-items-center" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  User updated successfully!
                </div>
              )}
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={selectedUser.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                disabled={loading} // Disable the Cancel button while loading
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;