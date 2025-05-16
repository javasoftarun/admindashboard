import React from "react";

const ViewUserModal = ({ show, onHide, user }) => {
  if (!show || !user) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: 16 }}>
          <div className="modal-header" style={{ background: "#fff" }}>
            <h5 className="modal-title">
              <i className="bi bi-person-circle me-2"></i>
              User Details
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body" style={{ background: "#fff" }}>
            <div className="text-center mb-3">
              <img
                src={user.imageUrl || "https://via.placeholder.com/100x100?text=No+Image"}
                alt={user.name}
                className="rounded-circle border"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>ID:</strong> {user.id}
              </li>
              <li className="list-group-item">
                <strong>Name:</strong> {user.name}
              </li>
              <li className="list-group-item">
                <strong>Email:</strong> {user.email}
              </li>
              <li className="list-group-item">
                <strong>Phone:</strong> {user.phone}
              </li>
              <li className="list-group-item">
                <strong>Role:</strong> {user.role}
              </li>
              <li className="list-group-item">
                <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
              </li>
              <li className="list-group-item">
                <strong>Created At:</strong>{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "-"}
              </li>
            </ul>
          </div>
          <div className="modal-footer" style={{ background: "#fff" }}>
            <button className="btn btn-warning text-dark fw-bold" onClick={onHide}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;