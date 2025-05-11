import React from "react";

const StatusModal = ({ show, onHide, title, message, isSuccess }) => {
  if (!show) return null;
  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.3)" }} tabIndex="-1">
      <div className="modal-dialog modal-sm">
        <div className="modal-content" style={{ borderRadius: 12 }}>
          <div className="modal-header border-0 pb-0">
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body text-center pt-0">
            <div style={{ fontSize: 48, marginBottom: 8 }}>
              {isSuccess ? (
                <span role="img" aria-label="success" style={{ color: "#28a745" }}>✔️</span>
              ) : (
                <span role="img" aria-label="error" style={{ color: "#dc3545" }}>❌</span>
              )}
            </div>
            <h5 className="mb-2" style={{ color: isSuccess ? "#28a745" : "#dc3545" }}>{title}</h5>
            <div className="mb-2" style={{ fontSize: "1.05em" }}>{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;