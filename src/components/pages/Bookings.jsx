import React, { useState, useEffect, useCallback } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import UserDetailsModal from "../modal/UserDetailsModal";
import BookingDetailsModal from "../modal/BookingDetailsModal";
import CabDetailsModal from "../modal/CabDetailsModal";
import ModifyBookingModal from "../modal/ModifyBookingModal";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import API_ENDPOINTS from "../config/apiConfig";
import CancelBookingModal from "../modal/cancelBookingModal";
import AssignCabModal from "../modal/AssignCabModal";
import StatusModal from "../modal/StatusModal";

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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showAssignCabModal, setShowAssignCabModal] = useState(false);
  const [availableCabs, setAvailableCabs] = useState([]);
  const [assignCabBooking, setAssignCabBooking] = useState(null);
  const [assignCabLoading, setAssignCabLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortField, setSortField] = useState("pickupDateTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusModal, setStatusModal] = useState({
    show: false,
    isSuccess: true,
    title: "",
    message: ""
  });
  // Place this above your useEffect
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_ALL_BOOKINGS);
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
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);


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
      updateLoadingState(bookingId, "loadingUser", true);
      const response = await axios.get(API_ENDPOINTS.GET_USER_BY_ID(userId));
      if (response.data.responseCode === 200) {
        setUserDetails(response.data.responseData[0]);
        setShowUserModal(true);
      } else {
        console.error("Failed to fetch user details:", response.data.responseMessage);
      }
      updateLoadingState(bookingId, "loadingUser", false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      updateLoadingState(bookingId, "loadingUser", false);
    }
  };

  // Fetch cab details by cab registration ID
  const handleViewCabDetails = async (cabRegistrationId, bookingId) => {
    try {
      updateLoadingState(bookingId, "loadingCab", true);
      const response = await axios.get(API_ENDPOINTS.GET_CAB_BY_ID(cabRegistrationId));
      if (response.data.responseCode === 200) {
        setCabDetails(response.data.responseData[0]);
        setShowCabModal(true);
      } else {
        console.error("Failed to fetch cab details:", response.data.responseMessage);
      }
      updateLoadingState(bookingId, "loadingCab", false);
    } catch (error) {
      console.error("Error fetching cab details:", error);
      updateLoadingState(bookingId, "loadingCab", false);
    }
  };

  const handleSaveModifiedBooking = () => {
    setShowModifyModal(false);
    fetchBookings(); // This will refresh the bookings list
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const payload = {
        bookingId: bookingId,
        bookingStatus: "Canceled",
        paymentStatus: null,
        role: localStorage.getItem("role"),
      };

      const response = await axios.put(API_ENDPOINTS.UPDATE_BOOKING_STATUS, payload);

      if (response.data.responseCode === 200) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingId === bookingId
              ? { ...booking, bookingStatus: "Canceled" }
              : booking
          )
        );
        console.log(`Booking with ID ${bookingId} canceled successfully.`);
      } else {
        console.error("Failed to cancel booking:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const handleShowAssignCabModal = async (booking) => {
    setAssignCabBooking(booking);
    setShowAssignCabModal(true);
    setAssignCabLoading(true);

    const pickupLocation = booking.pickupLocation || "";
    const dropLocation = booking.dropLocation || "";
    const pickupDateTime = booking.pickupDateTime || new Date().toISOString();
    const dropDateTime = booking.dropDateTime || new Date().toISOString();
    const radius = 15;

    // Validate all required fields
    if (
      !pickupLocation.trim() ||
      !dropLocation.trim() ||
      !pickupDateTime ||
      !dropDateTime
    ) {
      setAvailableCabs([]);
      setAssignCabLoading(false);
      alert("All pickup/drop locations are required to search for cabs.");
      return;
    }

    try {
      const payload = {
        pickupLocation,
        dropLocation,
        pickupDateTime,
        dropDateTime,
        radius,
      };

      const response = await axios.post(API_ENDPOINTS.SEARCH_AVAILABLE_CABS, payload);
      setAvailableCabs(response.data.responseData || []);
    } catch (error) {
      setAvailableCabs([]);
    }
    setAssignCabLoading(false);
  };

  const handleAssignCab = async (cab) => {
    try {
      const payload = {
        bookingId: assignCabBooking.bookingId,
        cabRegistrationId: cab.cabRegistrationId,
        bookingStatus: "Pending",
        paymentStatus: null,
        role: localStorage.getItem("role"),
      };

      await axios.put(API_ENDPOINTS.UPDATE_BOOKING_STATUS, payload);
      setShowAssignCabModal(false);
      setStatusModal({
        show: true,
        isSuccess: true,
        title: "Success",
        message: "Cab assigned successfully!"
      });
      fetchBookings(); // <-- Refresh bookings here
    } catch (error) {
      setStatusModal({
        show: true,
        isSuccess: false,
        title: "Failed",
        message: "Failed to assign cab. Please try again."
      });
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row mb-4 justify-content-center">
          <div className="col-lg-12">
            <div className="card border-0 shadow-sm" style={{ background: "#f8fafc" }}>
              <div className="card-body py-3">
                <div className="row g-3 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label fw-semibold mb-1">
                      <i className="bi bi-funnel-fill me-2 text-primary"></i>Status
                    </label>
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold mb-1">
                      <i className="bi bi-calendar-event me-2 text-primary"></i>Pickup Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateFilter}
                      onChange={e => setDateFilter(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold mb-1">Sort By</label>
                    <select
                      className="form-select"
                      value={sortField}
                      onChange={e => setSortField(e.target.value)}
                    >
                      <option value="pickupDateTime">Pickup Date</option>
                      <option value="fare">Fare</option>
                      <option value="bookingId">Booking ID</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold mb-1">Order</label>
                    <select
                      className="form-select"
                      value={sortOrder}
                      onChange={e => setSortOrder(e.target.value)}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        setStatusFilter("");
                        setDateFilter("");
                        setSortField("pickupDateTime");
                        setSortOrder("desc");
                      }}
                      style={{ height: 38 }}
                    >
                      <i className="bi bi-x-circle me-1"></i>Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="row">
            {bookings
              .filter(booking =>
                (!statusFilter || booking.bookingStatus === statusFilter) &&
                (!dateFilter || booking.pickupDateTime?.slice(0, 10) === dateFilter)
              )
              .sort((a, b) => {
                let aValue = a[sortField];
                let bValue = b[sortField];
                // For date, convert to Date object
                if (sortField === "pickupDateTime") {
                  aValue = new Date(aValue);
                  bValue = new Date(bValue);
                }
                if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
                if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
                return 0;
              })
              .map((booking) => (
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
                          disabled={booking.bookingStatus === "Canceled" || booking.bookingStatus === "Completed"}
                        >
                          Modify Booking
                        </button>
                        {booking.bookingStatus === "Canceled" && booking.bookingStatusUpdatedBy !== "USER" ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleShowAssignCabModal(booking)}
                          >
                            Assign New Cab
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              setBookingToCancel(booking.bookingId);
                              setShowCancelModal(true);
                            }}
                            disabled={booking.bookingStatus === "Canceled" || booking.bookingStatus === "Completed"}
                          >
                            Cancel Booking
                          </button>
                        )}
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

        <CancelBookingModal
          show={showCancelModal}
          onHide={() => setShowCancelModal(false)}
          onConfirm={(bookingId) => {
            handleCancelBooking(bookingId);
            setShowCancelModal(false);
          }}
          bookingId={bookingToCancel}
        />
        {/* Assign Cab Modal */}
        <AssignCabModal
          show={showAssignCabModal}
          onHide={() => setShowAssignCabModal(false)}
          cabs={availableCabs}
          loading={assignCabLoading}
          onAssign={handleAssignCab}
        />

        <StatusModal
          show={statusModal.show}
          onHide={() => setStatusModal({ ...statusModal, show: false })}
          title={statusModal.title}
          message={statusModal.message}
          isSuccess={statusModal.isSuccess}
        />
      </div>
    </Layout>
  );
};

export default Bookings;