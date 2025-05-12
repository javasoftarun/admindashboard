import React from "react";

const ViewCabDetailsModal = ({ show, onHide, cab }) => {
  if (!show || !cab) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        background: "rgba(0,0,0,0.45)",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div
          className="modal-content"
          style={{
            borderRadius: "18px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
            overflow: "hidden",
            border: "none",
          }}
        >
          <div
            className="modal-header"
            style={{
              background: "white",
              color: "#212529",
              alignItems: "center",
              borderBottom: "1px solid gray",
            }}
          >
            <div className="d-flex align-items-center">
              <div
                style={{
                  background: "white",
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  border: "2px solid #ffc107",
                }}
              >
                <i className="bi bi-truck" style={{ color: "#ffc107", fontSize: "2rem" }}></i>
              </div>
              <div>
                <h5 className="modal-title mb-0 fw-bold">
                  Cab Details
                </h5>
                <div className="small" style={{ opacity: 0.85 }}>
                  <span style={{ color: "#ffc107" }}>{cab.cab?.cabName}</span> <span className="text-dark-50">#{cab.registrationId}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              style={{ filter: "invert(70%) sepia(100%) saturate(500%) hue-rotate(10deg)" }}
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body pb-0" style={{ background: "#f8fafc" }}>
            <div className="row">
              <div className="col-md-5 text-center mb-3">
                <div>
                  <img
                    src={cab.cab?.cabImageUrl}
                    alt="Cab"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: 200,
                      objectFit: "cover",
                      width: "100%",
                      background: "#fffde7",
                    }}
                  />
                </div>
                <span className="badge bg-warning text-dark fs-6 px-3 py-2 mb-2">
                  {cab.cab?.cabType}
                </span>
                <div className="mt-2">
                  <span className="badge bg-light text-dark border px-3 py-2">
                    <i className="bi bi-car-front me-1" style={{ color: "#ffc107" }}></i>
                    <span style={{ color: "#ffc107" }}>{cab.cab?.cabModel}</span> &nbsp;|&nbsp; {cab.cab?.cabColor}
                  </span>
                </div>
              </div>
              <div className="col-md-7">
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th className="text-secondary" style={{ width: 140 }}>Registration ID</th>
                      <td>{cab.registrationId}</td>
                    </tr>
                    <tr>
                      <th className="text-secondary">Cab Name</th>
                      <td><span style={{ color: "#ffc107", fontWeight: 500 }}>{cab.cab?.cabName}</span></td>
                    </tr>
                    <tr>
                      <th className="text-secondary">Cab Number</th>
                      <td>{cab.cab?.cabNumber}</td>
                    </tr>
                    <tr>
                      <th className="text-secondary">Capacity</th>
                      <td>{cab.cab?.cabCapacity}</td>
                    </tr>
                    <tr>
                      <th className="text-secondary">Insurance</th>
                      <td>
                        {cab.cab?.cabInsurance === "YES" ? (
                          <span className="badge bg-success">Yes</span>
                        ) : (
                          <span className="badge bg-danger">No</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-secondary">Owner Name</th>
                      <td>{cab.ownerName}</td>
                    </tr>
                    <tr>
                      <th className="text-secondary">Driver Name</th>
                      <td>{cab.driverName}</td>
                    </tr>
                    <tr>
                      <th className="text-secondary">Driver Contact</th>
                      <td>{cab.driverContact}</td>
                    </tr>
                    <tr>
                      <th className="text-secondary">Address</th>
                      <td>{cab.address}</td>
                    </tr>
                    <tr>
                      <th className="text-secondary">Status</th>
                      <td>
                        <span
                          className={
                            "badge px-3 py-2 fs-6 " +
                            (cab.status === "Active"
                              ? "bg-success"
                              : cab.status === "Inactive"
                              ? "bg-secondary"
                              : "bg-warning text-dark")
                          }
                        >
                          {cab.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{ borderTop: "none", background: "white" }}>
            <button className="btn btn-warning px-4 text-dark fw-bold" onClick={onHide}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCabDetailsModal;