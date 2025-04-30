import React from "react";

const DeleteCabModal = ({ show, cabDetails, onConfirm, onCancel, deleting, message }) => {
  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            {message ? (
              <p className={message.type === "success" ? "text-success" : "text-danger"}>{message.text}</p>
            ) : (
              <p>
                Are you sure you want to delete the cab <strong>{cabDetails?.cabName}</strong> with
                Registration ID <strong>{cabDetails?.registrationId}</strong>?
              </p>
            )}
          </div>
          <div className="modal-footer">
            {!message && (
              <>
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={deleting}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={deleting}>
                  {deleting ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </>
            )}
            {message && (
              <button type="button" className="btn btn-primary" onClick={onCancel}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCabModal;