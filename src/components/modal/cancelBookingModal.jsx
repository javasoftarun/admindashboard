import React, { useState } from "react";

const CancelBookingModal = ({ show, onHide, onConfirm, bookingId }) => {
  const [loading, setLoading] = useState(false); // State to track loading

  const handleConfirm = async () => {
    setLoading(true); // Set loading to true
    await onConfirm(bookingId); // Call the onConfirm function
    setLoading(false); // Set loading to false after completion
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Cancellation</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to cancel this booking?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
              disabled={loading} // Disable the button while loading
            >
              No
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirm}
              disabled={loading} // Disable the button while loading
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Canceling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;