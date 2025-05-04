import React from "react";

const UserDetailsModal = ({ show, onHide, userDetails }) => {
  if (!show) return null; // Don't render the modal if `show` is false

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">User Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {userDetails ? (
              <div className="card">
                <div className="card-header bg-info text-white">
                  <h6 className="mb-0">👤 Personal Information</h6>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Name:</strong> {userDetails.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {userDetails.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {userDetails.phone}
                  </p>
                  <p>
                    <strong>Role:</strong> {userDetails.role}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-danger">User details not available.</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;