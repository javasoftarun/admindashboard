import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const BookingDetailsModal = ({ show, onHide, booking }) => {
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
            <h5 className="modal-title">
              Booking Details (ID: {booking?.bookingId})
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            {booking ? (
              <>
                {/* Section: Date and Location Details */}
                <div className="card mb-4">
                  <div className="card-header bg-warning text-dark">
                    <h6 className="mb-0">📍 Date and Location Details</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Pickup Date & Time:</strong>{" "}
                          {new Date(booking.pickupDateTime).toLocaleString()}
                        </p>
                        <p className="mb-1">
                          <strong>Pickup Location:</strong> {booking.pickupLocation}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Drop Date & Time:</strong>{" "}
                          {new Date(booking.dropDateTime).toLocaleString()}
                        </p>
                        <p className="mb-1">
                          <strong>Drop Location:</strong> {booking.dropLocation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Price Calculation */}
                <div className="card mb-4">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0">💰 Price Calculation</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Fare:</strong> ₹{booking.fare}
                        </p>
                        <p className="mb-1">
                          <strong>Promo Discount:</strong> ₹{booking.promoDiscount}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Token Amount:</strong> ₹{booking.tokenAmount}
                        </p>
                        <p className="mb-1">
                          <strong>Balance Amount:</strong> ₹{booking.balanceAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Payment Details */}
                <div className="card mb-4">
                  <div className="card-header bg-info text-white">
                    <h6 className="mb-0">💳 Payment Details</h6>
                  </div>
                  <div className="card-body">
                    {booking.paymentDetails ? (
                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Payment Method:</strong>{" "}
                            {booking.paymentDetails.paymentMethod}
                          </p>
                          <p className="mb-1">
                            <strong>Transaction ID:</strong>{" "}
                            {booking.paymentDetails.transactionId}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Transaction Date:</strong>{" "}
                            {new Date(booking.paymentDetails.transactionDate).toLocaleString()}
                          </p>
                          <p className="mb-1">
                            <strong>Payment Amount:</strong> ₹
                            {booking.paymentDetails.amount}
                          </p>
                          <p className="mb-1">
                            <strong>Payment Status:</strong>{" "}
                            {booking.paymentDetails.status}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-danger">Payment details not available.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-danger">Booking details not available.</p>
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

export default BookingDetailsModal;