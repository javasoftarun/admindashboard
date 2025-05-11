import React, { useState } from "react";

const AssignCabModal = ({ show, onHide, cabs, loading, onAssign }) => {
    const [assigningId, setAssigningId] = useState(null);

    if (!show) return null;

    // Filter out null cabs and sort by totalDistance ascending
    const filteredCabs = Array.isArray(cabs)
        ? cabs.filter(Boolean).sort((a, b) => (a.totalDistance || 0) - (b.totalDistance || 0))
        : [];

    const handleAssign = async (cab) => {
        setAssigningId(cab.cabRegistrationId);
        await onAssign(cab);
        setAssigningId(null);
    };

    return (
        <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-md">
                <div className="modal-content">
                    <div className="modal-header py-2">
                        <h5 className="modal-title fs-6">Available Cabs</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body p-2">
                        {loading ? (
                            <div className="text-center">
                                <span className="spinner-border text-primary"></span>
                            </div>
                        ) : filteredCabs.length === 0 ? (
                            <div className="alert alert-warning m-2">No cabs available.</div>
                        ) : (
                            <div className="row">
                                {filteredCabs.map((cab) => (
                                    <div className="col-12 mb-2" key={cab.cabRegistrationId}>
                                        <div className="card h-100 shadow-sm flex-row align-items-center" style={{ minHeight: 120 }}>
                                            <div
                                                style={{
                                                    width: 120,
                                                    height: 120,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: "#f8f9fa",
                                                    borderRadius: 10,
                                                    margin: 12,
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                                                }}
                                            >
                                                <img
                                                    src={cab.cabImageUrl}
                                                    alt={cab.cabName}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "contain",
                                                        borderRadius: 8,
                                                    }}
                                                />
                                            </div>
                                            <div className="card-body py-2 px-2">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="fw-bold" style={{ fontSize: "1.1em" }}>
                                                        {cab.cabName}
                                                        <span className="text-muted ms-2" style={{ fontSize: "0.95em" }}>
                                                            #{cab.cabRegistrationId}
                                                        </span>
                                                    </span>
                                                    <span className="badge bg-secondary">{cab.cabType}</span>
                                                </div>
                                                <div style={{ fontSize: "0.95em" }}>
                                                    <span className="me-2"><strong>Model:</strong> {cab.cabModel}</span>
                                                    <span><strong>Color:</strong> {cab.cabColor}</span>
                                                </div>
                                                <div style={{ fontSize: "0.95em" }}>
                                                    <span className="me-2"><strong>Fare:</strong> ₹{cab.fare.toFixed(2)}</span>
                                                    <span><strong>Capacity:</strong> {cab.cabCapacity}</span>
                                                </div>
                                                <div style={{ fontSize: "0.95em" }}>
                                                    <span className="me-2"><strong>Base Fare:</strong> ₹{cab.baseFare}</span>
                                                    <span><strong>Per Km Rate:</strong> ₹{cab.perKmRate}</span>
                                                </div>
                                                <div style={{ fontSize: "1em" }}>
                                                    <span>
                                                        <strong>Total Distance:</strong>{" "}
                                                        <span className="badge bg-primary" style={{ fontSize: "1em" }}>
                                                            {cab.totalDistance} km
                                                        </span>
                                                    </span>
                                                </div>
                                                <button
                                                    className="btn btn-success btn-sm py-0 px-2 mt-2"
                                                    style={{ fontSize: "0.75em", height: "24px", minWidth: "50px" }}
                                                    onClick={() => handleAssign(cab)}
                                                    disabled={assigningId === cab.cabRegistrationId}
                                                >
                                                    {assigningId === cab.cabRegistrationId ? "Assigning..." : "Assign"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignCabModal;