import React from "react";

const UserBookingsModal = ({ show, onHide, bookings, loading, error, user }) => {
    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.45)", zIndex: 1060 }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content" style={{ borderRadius: 16 }}>
                    <div className="modal-header text-dark" style={{ background: "#fff", borderBottom: "2px solid #ffc107" }}>
                        <h5 className="modal-title">
                            <i className="bi bi-calendar-check me-2"></i>
                            Bookings for {user?.name || "User"}
                        </h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body" style={{ background: "#fff" }}>
                        {loading && <div>Loading...</div>}
                        {error && <div className="text-danger">{error}</div>}
                        {!loading && !error && bookings && bookings.length === 0 && (
                            <div>No bookings found for this user.</div>
                        )}
                        {!loading && !error && bookings && bookings.length > 0 && (
                            <div className="list-group">
                                {bookings.map((b) => (
                                    <div key={b.bookingId} className="list-group-item mb-2 border rounded shadow-sm">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="fw-bold text-secondary">#{b.bookingId}</span>
                                                <span className="badge bg-info ms-2">{b.bookingStatus || "Pending"}</span>
                                            </div>
                                            <div>
                                                <span className="fw-semibold">Cab:</span> {b.cabName} ({b.cabNumber})
                                            </div>
                                        </div>

                                        <div className="mt-3 d-flex align-items-center" style={{ minWidth: 0, width: "100%" }}>
                                            {/* Pickup Location (left) */}
                                            <div
                                                className="fw-semibold d-flex align-items-center"
                                                style={{
                                                    minWidth: 0,
                                                    maxWidth: "38%",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "normal",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start"
                                                }}
                                                title={b.pickupLocation}
                                            >
                                                <span>
                                                    <i className="bi bi-geo-alt-fill text-danger me-1" title="Pickup"></i>
                                                    {b.pickupLocation}
                                                </span>
                                                <span className="small text-muted">
                                                    <span className="fw-semibold">Pickup:</span>{" "}
                                                    {b.pickupDateTime
                                                        ? new Date(b.pickupDateTime).toLocaleString("en-IN", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })
                                                        : "-"}
                                                </span>
                                            </div>
                                            {/* Arrow (center) */}
                                            <div className="flex-grow-1 text-center" style={{ minWidth: 0, maxWidth: "24%" }}>
                                                <i className="bi bi-arrow-right-short fs-3 text-secondary" title="to"></i>
                                            </div>
                                            {/* Drop Location (right) */}
                                            <div
                                                className="fw-semibold d-flex align-items-center justify-content-end"
                                                style={{
                                                    minWidth: 0,
                                                    maxWidth: "38%",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "normal",
                                                    flexDirection: "column",
                                                    alignItems: "flex-end"
                                                }}
                                                title={b.dropLocation}
                                            >
                                                <span>
                                                    <i className="bi bi-geo-alt-fill text-success me-1" title="Drop"></i>
                                                    {b.dropLocation}
                                                </span>
                                                <span className="small text-muted">
                                                    <span className="fw-semibold">Drop:</span>{" "}
                                                    {b.dropDateTime
                                                        ? new Date(b.dropDateTime).toLocaleString("en-IN", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })
                                                        : "-"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <span className="fw-semibold">Fare:</span> ₹{b.fare?.toFixed(2) ?? "-"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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

export default UserBookingsModal;