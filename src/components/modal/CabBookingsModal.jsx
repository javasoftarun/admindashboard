import React from "react";
import LoadingSpinner from "../spinner/LoadingSpinner";

const CabBookingsModal = ({ show, onHide, bookings, loading, error }) => {
    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.45)", zIndex: 1060 }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content" style={{ borderRadius: 16 }}>
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">
                            <i className="bi bi-calendar-check me-2" style={{ color: "#ffc107" }}></i>
                            Cab Bookings
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
                    </div>
                    <div className="modal-body" style={{ background: "#f8f9fa", maxHeight: 500, overflowY: "auto" }}>
                        {loading && <LoadingSpinner />}
                        {error && <div className="text-danger">{error}</div>}
                        {!loading && !error && bookings && bookings.length === 0 && (
                            <div>No bookings found for this cab.</div>
                        )}
                        {!loading && !error && bookings && bookings.length > 0 && (
                            <div className="row g-2">
                                {bookings.map((b) => (
                                    <div className="col-12" key={b.bookingId}>
                                        <div className="card flex-row align-items-center p-2 shadow-sm border-0" style={{ minHeight: 70, fontSize: "0.95rem" }}>
                                            <div className="flex-shrink-0 d-flex flex-column align-items-center justify-content-center px-2" style={{ minWidth: 60 }}>
                                                <span className="fw-bold text-secondary" style={{ fontSize: "1.1rem" }}>#{b.bookingId}</span>
                                                <span className={
                                                    "badge mt-1 " +
                                                    (b.bookingStatus === "Completed"
                                                        ? "bg-success"
                                                        : b.bookingStatus === "Cancelled"
                                                            ? "bg-danger"
                                                            : "bg-warning text-dark")
                                                }>
                                                    {b.bookingStatus || "-"}
                                                </span>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div><span className="fw-semibold">User:</span> {b.userName || b.userId}</div>
                                                        <div><span className="fw-semibold">Pickup:</span> {b.pickupLocation}</div>
                                                        <div><span className="fw-semibold">Drop:</span> {b.dropLocation}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div><span className="fw-semibold">Date:</span> {b.pickupDateTime ? new Date(b.pickupDateTime).toLocaleString() : "-"}  {/* Upcoming/Past badge */}
                                                            {(() => {
                                                                const now = new Date();
                                                                const pickup = b.pickupDateTime ? new Date(b.pickupDateTime) : null;
                                                                if (pickup) {
                                                                    if (pickup >= now.setHours(0, 0, 0, 0)) {
                                                                        return <span className="badge bg-info mt-1">Upcoming</span>;
                                                                    } else {
                                                                        return <span className="badge bg-secondary mt-1">Past</span>;
                                                                    }
                                                                }
                                                                return null;
                                                            })()}</div>
                                                        <div><span className="fw-semibold">Fare:</span> ₹{b.fare?.toFixed(2) ?? "-"}</div>
                                                        <div>
                                                            <span className="fw-semibold">Payment:</span>{" "}
                                                            <span className={
                                                                "badge " +
                                                                (b.paymentStatus === "success"
                                                                    ? "bg-success"
                                                                    : b.paymentStatus === "partial"
                                                                        ? "bg-warning text-dark"
                                                                        : "bg-secondary")
                                                            }>
                                                                {b.paymentStatus || "-"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer" style={{ background: "#f8f9fa" }}>
                        <button className="btn btn-warning text-dark fw-bold" onClick={onHide}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CabBookingsModal;