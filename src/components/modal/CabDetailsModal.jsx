import React from "react";

const CabDetailsModal = ({ show, onHide, cabDetails }) => {
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
            <h5 className="modal-title">Cab Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {cabDetails ? (
              <>
                {/* Cab Information */}
                <div className="card mb-4">
                  <div className="card-header bg-info text-white">
                    <h6 className="mb-0">🚖 Cab Information</h6>
                  </div>
                  <div className="card-body">
                    {/* Cab Image */}
                    {cabDetails.cab.cabImageUrl && (
                      <div className="text-center mb-3">
                        <img
                          src={cabDetails.cab.cabImageUrl}
                          alt="Cab"
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <p>
                      <strong>Cab Name:</strong> {cabDetails.cab.cabName}
                    </p>
                    <p>
                      <strong>Cab Type:</strong> {cabDetails.cab.cabType}
                    </p>
                    <p>
                      <strong>Cab Number:</strong> {cabDetails.cab.cabNumber}
                    </p>
                    <p>
                      <strong>Cab Model:</strong> {cabDetails.cab.cabModel}
                    </p>
                    <p>
                      <strong>Cab Color:</strong> {cabDetails.cab.cabColor}
                    </p>
                    <p>
                      <strong>Cab Capacity:</strong> {cabDetails.cab.cabCapacity}
                    </p>
                    <p>
                      <strong>Cab Insurance:</strong> {cabDetails.cab.cabInsurance}
                    </p>
                    <p>
                      <strong>City:</strong> {cabDetails.cab.cabCity}
                    </p>
                    <p>
                      <strong>State:</strong> {cabDetails.cab.cabState}
                    </p>
                  </div>
                </div>

                {/* Driver Information */}
                <div className="card mb-4">
                  <div className="card-header bg-warning text-dark">
                    <h6 className="mb-0">👨‍✈️ Driver Information</h6>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Driver Name:</strong> {cabDetails.driverName}
                    </p>
                    <p>
                      <strong>Driver Contact:</strong> {cabDetails.driverContact}
                    </p>
                    <p>
                      <strong>Driver License:</strong> {cabDetails.driverLicense}
                    </p>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="card mb-4">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0">💰 Pricing Information</h6>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Base Fare:</strong> ₹{cabDetails.baseFare}
                    </p>
                    <p>
                      <strong>Per Km Rate:</strong> ₹{cabDetails.perKmRate}
                    </p>
                  </div>
                </div>

                {/* Location Information */}
                <div className="card mb-4">
                  <div className="card-header bg-secondary text-white">
                    <h6 className="mb-0">📍 Location Information</h6>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Address:</strong> {cabDetails.address}
                    </p>
                    <p>
                      <strong>Latitude:</strong> {cabDetails.latitude}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {cabDetails.longitude}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-danger">Cab details not available.</p>
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

export default CabDetailsModal;