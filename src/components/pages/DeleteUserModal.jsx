import React, { useState } from "react";

const DeleteUserModal = ({ showModal, setShowModal, handleDelete, selectedUser }) => {
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    setLoading(true); 
    setMessage("");
    const isDeleted = await handleDelete(selectedUser.id); // Call the delete function
    setLoading(false); // Stop loading

    if (isDeleted) {
      setMessage("User deleted successfully!"); // Show success message
      setTimeout(() => {
        setShowModal(false); // Close the modal after 2 seconds
        setMessage(""); // Clear the message
      }, 2000);
    } else {
      setMessage("Failed to delete user. Please try again."); // Show failure message
    }
  };

  if (!showModal) return null; // Don't render the modal if it's not visible

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
              disabled={loading} // Disable close button while loading
            ></button>
          </div>
          <div className="modal-body">
            {message && (
              <div
                className={`alert ${
                  message.includes("successfully") ? "alert-success" : "alert-danger"
                } d-flex align-items-center`}
                role="alert"
              >
                <i
                  className={`bi ${
                    message.includes("successfully")
                      ? "bi-check-circle-fill"
                      : "bi-exclamation-triangle-fill"
                  } me-2`}
                ></i>
                {message}
              </div>
            )}
            {!message && (
              <p>
                Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>?
              </p>
            )}
          </div>
          <div className="modal-footer">
            {!message && (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={loading} // Disable cancel button while loading
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                  disabled={loading} // Disable delete button while loading
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;