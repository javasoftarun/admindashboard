import React, { useState } from "react";

const CabSelectModal = ({ show, cabs, onSelect, onHide, loading, currentCabRegistrationId }) => {
    // Move useState to the top!
    const [showAll, setShowAll] = useState(false);

    if (!show) return null;

    // Filter out null/undefined cabs
    const validCabs = (cabs || []).filter(Boolean);

    // Separate filtered and other cabs
    const filteredCabs = currentCabRegistrationId
        ? validCabs.filter(cab => cab.cabRegistrationId === currentCabRegistrationId)
        : [];
    const otherCabs = currentCabRegistrationId
        ? validCabs.filter(cab => cab.cabRegistrationId !== currentCabRegistrationId)
        : validCabs;

    // Combine filtered and (optionally) other cabs for display
    const displayCabs = showAll ? [...filteredCabs, ...otherCabs] : filteredCabs;

    return (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Select a Cab</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <div className="text-center py-4">
                                <span className="spinner-border text-primary"></span>
                            </div>
                        ) : displayCabs.length > 0 ? (
                            <div className="row">
                                {displayCabs.map((cab) => (
                                    <div className="col-12 mb-4" key={cab.cabRegistrationId}>
                                        <div className="card h-100 shadow border-0">
                                            <div className="card-body d-flex align-items-center">
                                                <div
                                                    style={{
                                                        width: 110,
                                                        height: 110,
                                                        background: "#f8f9fa",
                                                        borderRadius: 12,
                                                        marginRight: 24,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
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
                                                            borderRadius: 10,
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold" style={{ fontSize: "1.1em" }}>
                                                        {cab.cabName} <span className="text-muted">#{cab.cabRegistrationId}</span>
                                                    </div>
                                                    <div className="badge bg-secondary mb-2">{cab.cabType}</div>
                                                    <div style={{ fontSize: "0.97em" }}>
                                                        <strong>Model:</strong> {cab.cabModel} &nbsp;|&nbsp;
                                                        <strong>Color:</strong> {cab.cabColor}
                                                    </div>
                                                    <div style={{ fontSize: "0.97em" }}>
                                                        <strong>Capacity:</strong> {cab.cabCapacity}
                                                    </div>
                                                    <div style={{ fontSize: "0.97em" }}>
                                                        <strong>Total Distance:</strong> {cab.totalDistance} km
                                                    </div>
                                                    <div style={{ fontSize: "1.05em" }}>
                                                        <strong>Fare:</strong> <span className="text-success">₹{cab.fare}</span>
                                                    </div>
                                                </div>
                                                <div className="ms-3">
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        style={{ minWidth: 90 }}
                                                        onClick={() => onSelect(cab)}
                                                    >
                                                        Select
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!showAll && otherCabs.length > 0 && (
                                    <div className="col-12 text-center">
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowAll(true)}
                                        >
                                            Load More
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="alert alert-warning text-center">No cabs available.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CabSelectModal;