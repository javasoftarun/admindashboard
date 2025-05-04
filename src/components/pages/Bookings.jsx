import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import UserDetailsModal from "../modal/UserDetailsModal";
import BookingDetailsModal from "../modal/BookingDetailsModal";
import CabDetailsModal from "../modal/CabDetailsModal";
import ModifyBookingModal from "../modal/ModifyBookingModal";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [cabDetails, setCabDetails] = useState(null);
  const [showCabModal, setShowCabModal] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [showModifyModal, setShowModifyModal] = useState(false);

  // Fetch bookings from the API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://carbookingservice.onrender.com/api/cab/booking/find/all");
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

  // Update loading state for a specific card
  const updateLoadingState = (bookingId, type, isLoading) => {
    setLoadingStates((prevState) => ({
      ...prevState,
      [bookingId]: {
        ...prevState[bookingId],
        [type]: isLoading,
      },
    }));
  };

  // Fetch user details by user ID
  const handleViewUserDetails = async (userId, bookingId) => {
    try {
      updateLoadingState(bookingId, "loadingUser", true); // Start loading for this card
      const response = await axios.get(`https://userservice-a0nr.onrender.com/api/users/${userId}`);
      if (response.data.responseCode === 200) {
        setUserDetails(response.data.responseData[0]);
        setShowUserModal(true);
      } else {
        console.error("Failed to fetch user details:", response.data.responseMessage);
      }
      updateLoadingState(bookingId, "loadingUser", false); // Stop loading for this card
    } catch (error) {
      console.error("Error fetching user details:", error);
      updateLoadingState(bookingId, "loadingUser", false); // Stop loading for this card
    }
  };

  // Fetch cab details by cab registration ID
  const handleViewCabDetails = async (cabRegistrationId, bookingId) => {
    try {
      updateLoadingState(bookingId, "loadingCab", true); // Start loading for this card
      const response = await axios.get(`https://carbookingservice.onrender.com/api/cab/registration/get/${cabRegistrationId}`);
      if (response.data.responseCode === 200) {
        setCabDetails(response.data.responseData[0]);
        setShowCabModal(true);
      } else {
        console.error("Failed to fetch cab details:", response.data.responseMessage);
      }
      updateLoadingState(bookingId, "loadingCab", false); // Stop loading for this card
    } catch (error) {
      console.error("Error fetching cab details:", error);
      updateLoadingState(bookingId, "loadingCab", false); // Stop loading for this card
    }
  };

  // Handle saving modified booking
  const handleSaveModifiedBooking = (updatedBooking) => {
    // Update the booking in the state
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingId === updatedBooking.bookingId ? updatedBooking : booking
      )
    );
    console.log("Modified Booking:", updatedBooking);
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
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowBookingModal(true);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                  <div className="card-body">
                    <p className="mb-1">
                      <strong>User ID:</strong> {booking.userId}{" "}
                      <button
                        className="btn btn-link p-0 text-primary d-inline-flex align-items-center"
                        onClick={() => handleViewUserDetails(booking.userId, booking.bookingId)}
                        style={{ textDecoration: "none", fontSize: "14px" }}
                        title="View User Details"
                        disabled={loadingStates[booking.bookingId]?.loadingUser} // Disable button while loading
                      >
                        {loadingStates[booking.bookingId]?.loadingUser ? (
                          <span className="spinner-border spinner-border-sm text-primary"></span>
                        ) : (
                          <>
                            <i className="bi bi-person-circle me-1"></i> View User
                          </>
                        )}
                      </button>
                    </p>
                    <p className="mb-1">
                      <strong>Cab Registration ID:</strong> {booking.cabRegistrationId}{" "}
                      <button
                        className="btn btn-link p-0 text-primary d-inline-flex align-items-center"
                        onClick={() => handleViewCabDetails(booking.cabRegistrationId, booking.bookingId)}
                        style={{ textDecoration: "none", fontSize: "14px" }}
                        title="View Cab Details"
                        disabled={loadingStates[booking.bookingId]?.loadingCab} // Disable button while loading
                      >
                        {loadingStates[booking.bookingId]?.loadingCab ? (
                          <span className="spinner-border spinner-border-sm text-primary"></span>
                        ) : (
                          <>
                            <i className="bi bi-truck me-1"></i> View Cab
                          </>
                        )}
                      </button>
                    </p>
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
                        onClick={() => {
                            setSelectedBooking(booking);
                            setShowModifyModal(true);
                          }}
                      >
                        Modify Booking
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelBooking(booking.bookingId)}
                      >
                        Cancel Booking
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
        <BookingDetailsModal
          show={showBookingModal}
          onHide={() => setShowBookingModal(false)}
          booking={selectedBooking}
        />

        {/* User Details Modal */}
        <UserDetailsModal
          show={showUserModal}
          onHide={() => setShowUserModal(false)}
          userDetails={userDetails}
        />

        {/* Cab Details Modal */}
        <CabDetailsModal
          show={showCabModal}
          onHide={() => setShowCabModal(false)}
          cabDetails={cabDetails}
        />

        {/* Modify Booking Modal */}
        <ModifyBookingModal
          show={showModifyModal}
          onHide={() => setShowModifyModal(false)}
          booking={selectedBooking}
          onSave={handleSaveModifiedBooking}
        />
      </div>
    </Layout>
  );
};

export default Bookings;