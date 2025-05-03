import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Bookings = () => {
    const [bookings, setBookings] = useState([]); // State to store bookings
    const [loading, setLoading] = useState(false); // Loading state
    const [selectedBooking, setSelectedBooking] = useState(null); // State for selected booking

    // Fetch bookings from the API
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://carbookingservice.onrender.com/api/cab/booking/find/all"); // Replace with your API endpoint
                if (response.data.responseCode === 200) {
                    setBookings(response.data.responseData);
                } else {
                    console.error("Failed to fetch bookings:", response.data.responseMessage);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Ensure modal is initialized properly when selectedBooking changes
    useEffect(() => {
        if (selectedBooking) {
            const modalElement = document.getElementById("bookingDetailsModal");
            const bootstrapModal = new window.bootstrap.Modal(modalElement);
            bootstrapModal.show();
        }
    }, [selectedBooking]);

    const handleUpdateBooking = (bookingId) => {
        console.log(`Update booking with ID: ${bookingId}`);
        // Add logic to update the booking
    };

    const handleCancelBooking = (bookingId) => {
        console.log(`Cancel booking with ID: ${bookingId}`);
        // Add logic to cancel the booking
    };

    return (
        <Layout>
            <div className="container mt-4">
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="row">
                        {bookings.map((booking) => (
                            <div key={booking.bookingId} className="col-lg-4 col-md-6 mb-4">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0">Booking ID: {booking.bookingId}</h6>
                                        <button
                                            className="btn btn-sm btn-dark"
                                            onClick={() => setSelectedBooking(booking)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1">
                                            <strong>Pickup:</strong> {booking.pickupLocation}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Drop:</strong> {booking.dropLocation}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Fare:</strong> ₹{booking.fare}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Status:</strong> {booking.bookingStatus || "N/A"}
                                        </p>
                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                className="btn btn-warning btn-sm text-dark"
                                                onClick={() => handleUpdateBooking(booking.bookingId)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleCancelBooking(booking.bookingId)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">No bookings found.</p>
                )}

                {/* Booking Details Modal */}
                <div
                    className="modal fade"
                    id="bookingDetailsModal"
                    tabIndex="-1"
                    aria-labelledby="bookingDetailsModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title" id="bookingDetailsModalLabel">
                                    Booking Details (ID: {selectedBooking?.bookingId})
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setSelectedBooking(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {selectedBooking && (
                                    <>
                                        <h6 className="text-secondary">Booking Details</h6>
                                        <p className="mb-1">
                                            <strong>User ID:</strong> {selectedBooking.userId}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Cab Registration ID:</strong> {selectedBooking.cabRegistrationId}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Pickup Location:</strong> {selectedBooking.pickupLocation}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Drop Location:</strong> {selectedBooking.dropLocation}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Pickup Date & Time:</strong>{" "}
                                            {new Date(selectedBooking.pickupDateTime).toLocaleString()}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Drop Date & Time:</strong>{" "}
                                            {new Date(selectedBooking.dropDateTime).toLocaleString()}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Fare:</strong> ₹{selectedBooking.fare}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Promo Discount:</strong> ₹{selectedBooking.promoDiscount}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Token Amount:</strong> ₹{selectedBooking.tokenAmount}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Balance Amount:</strong> ₹{selectedBooking.balanceAmount}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Status:</strong> {selectedBooking.bookingStatus || "N/A"}
                                        </p>
                                        <hr />
                                        <h6 className="text-secondary">Payment Details</h6>
                                        {selectedBooking.paymentDetails ? (
                                            <>
                                                <p className="mb-1">
                                                    <strong>Payment Method:</strong>{" "}
                                                    {selectedBooking.paymentDetails.paymentMethod}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Transaction ID:</strong>{" "}
                                                    {selectedBooking.paymentDetails.transactionId}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Transaction Date:</strong>{" "}
                                                    {new Date(selectedBooking.paymentDetails.transactionDate).toLocaleString()}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Payment Amount:</strong> ₹
                                                    {selectedBooking.paymentDetails.amount}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Payment Status:</strong>{" "}
                                                    {selectedBooking.paymentDetails.status}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-danger">Payment details not available.</p>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => setSelectedBooking(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Bookings;