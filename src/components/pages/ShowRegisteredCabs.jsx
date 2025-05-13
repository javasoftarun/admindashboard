import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import LoadingSpinner from "../spinner/LoadingSpinner";
import DeleteCabModal from "../modal/DeleteCabModal";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../config/apiConfig";
import ViewCabDetailsModal from "../modal/ViewCabDetailsModal";
import CabBookingsModal from "../modal/CabBookingsModal";

const ShowRegisteredCabs = () => {
  const navigate = useNavigate();
  const [cabs, setCabs] = useState([]);
  const [visibleCabs, setVisibleCabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [imageLoading, setImageLoading] = useState({});
  const [selectedCab, setSelectedCab] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [showCabModal, setShowCabModal] = useState(false);
  const [cabDetails, setCabDetails] = useState(null);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);

  // Fetch all registered cabs
  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.GET_ALL_CABS);
        if (!response.ok) {
          throw new Error("Failed to fetch cabs");
        }
        const data = await response.json();
        setCabs(data.responseData);
        setVisibleCabs(data.responseData.slice(0, itemsPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCabs();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter cabs based on search term
    const filtered = cabs.filter((cab) =>
      cab.cab.cabName.toLowerCase().includes(value) ||
      cab.ownerName.toLowerCase().includes(value) ||
      cab.driverName.toLowerCase().includes(value) ||
      cab.cab.cabNumber.toLowerCase().includes(value) ||
      cab.cab.cabType.toLowerCase().includes(value)
    );
    setVisibleCabs(filtered.slice(0, page * itemsPerPage));
  };

  // Load more cabs when scrolling
  const loadMoreCabs = () => {
    const nextPage = page + 1;
    const newVisibleCabs = cabs.slice(0, nextPage * itemsPerPage);
    setVisibleCabs(newVisibleCabs);
    setPage(nextPage);
  };

  // Detect when user scrolls to the bottom
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && visibleCabs.length < cabs.length) {
      loadMoreCabs();
    }
  };

  // Handle image loading
  const handleImageLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  // Define the action handlers
  const handleEdit = (cab) => {
    navigate(`/edit-cab/${cab.registrationId}`, { state: { cab } });
  };

  const handleDelete = (cab) => {
    setSelectedCab(cab);
    setShowDeleteModal(true);
    setModalMessage(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        API_ENDPOINTS.DELETE_CAB(selectedCab.registrationId),
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok && data.responseCode === 200) {
        setCabs((prevCabs) => prevCabs.filter((cab) => cab.registrationId !== selectedCab.registrationId));
        setVisibleCabs((prevVisibleCabs) =>
          prevVisibleCabs.filter((cab) => cab.registrationId !== selectedCab.registrationId)
        );
        setModalMessage({ type: "success", text: "Cab deleted successfully!" });
      } else {
        setModalMessage({ type: "error", text: `Failed to delete cab: ${data.responseMessage}` });
      }
    } catch (error) {
      console.error("Error deleting cab:", error);
      setModalMessage({ type: "error", text: "An error occurred while deleting the cab. Please try again." });
    } finally {
      setDeleting(false);
    }
  };

  const handleShowBookings = async (cab) => {
  setShowBookingsModal(true);
  setBookings([]);
  setBookingsLoading(true);
  setBookingsError(null);
  try {
    const response = await fetch(API_ENDPOINTS.GET_BOOKINGS_BY_CAB_REG_ID(cab.registrationId));
    if (!response.ok) throw new Error("Failed to fetch bookings");
    const data = await response.json();
    // Flatten the array if needed
    let bookingsArr = [];
    if (Array.isArray(data.responseData)) {
      // If first element is an array, flatten
      if (Array.isArray(data.responseData[0])) {
        bookingsArr = data.responseData.flat();
      } else {
        bookingsArr = data.responseData;
      }
    }
    setBookings(bookingsArr);
  } catch (err) {
    setBookingsError(err.message);
  } finally {
    setBookingsLoading(false);
  }
};

  return (
    <Layout>
      <div
        className="container mt-4 overflow-auto position-relative"
        onScroll={handleScroll}
      >
        <h1 className="mb-4" style={{ color: "#ffc107", fontWeight: 700, letterSpacing: 1 }}>
          <i className="bi bi-truck me-2" style={{ color: "#ffc107" }}></i>
          Registered Cabs
        </h1>

        {/* Search Bar */}
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control border-warning"
            placeholder="Search by cab name, owner, driver, cab number, or type..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="input-group-text border-warning bg-warning text-dark">
            <i className="bi bi-search"></i>
          </span>
        </div>

        {loading && <LoadingSpinner />}

        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && visibleCabs.length > 0 && (
          <div className="row">
            {visibleCabs.map((cab, index) => (
              <div className="col-md-6 col-lg-3 mb-4" key={cab.registrationId}>
                <div className="card h-100 d-flex flex-column">
                  <div className="position-relative">
                    {imageLoading[cab.registrationId] && (
                      <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-light">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    )}
                    <img
                      src={cab.cab.cabImageUrl}
                      className="card-img-top"
                      alt="Cab"
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        borderTopLeftRadius: "calc(0.375rem - 1px)",
                        borderTopRightRadius: "calc(0.375rem - 1px)",
                      }}
                      onLoad={() => handleImageLoad(cab.registrationId)}
                      onError={() => handleImageError(cab.registrationId)}
                      onLoadStart={() =>
                        setImageLoading((prev) => ({ ...prev, [cab.registrationId]: true }))
                      }
                    />
                  </div>
                  <div className="card-body flex-grow-1">
                    <h5 className="card-title" style={{ color: "#ffc107", fontWeight: 600 }}>
                      {cab.cab.cabName} <span style={{ color: "#212529" }}># {cab.registrationId}</span>
                    </h5>
                    <p className="card-text">
                      <strong>Owner:</strong> {cab.ownerName} <br />
                      <strong>Contact:</strong> {cab.driverContact} <br />
                      <strong>Address:</strong> {cab.address} <br />
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          "badge px-2 py-1 " +
                          (cab.status === "Active"
                            ? "bg-success"
                            : cab.status === "Inactive"
                              ? "bg-secondary"
                              : "bg-warning text-dark")
                        }
                      >
                        {cab.status}
                      </span>
                    </p>
                  </div>
                  <div className="card-footer d-flex justify-content-end gap-1 mt-auto bg-white border-0 py-2 px-1">
                    <button
                      className="btn btn-outline-warning btn-xs d-flex align-items-center px-2 py-1"
                      style={{ fontSize: "0.85rem", fontWeight: 500, borderColor: "#ffc107" }}
                      title="View Details"
                      onClick={() => {
                        setCabDetails(cab);
                        setShowCabModal(true);
                      }}
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </button>
                    <button
                      className="btn btn-outline-dark btn-xs d-flex align-items-center px-2 py-1"
                      style={{ fontSize: "0.85rem" }}
                      title="View Bookings"
                      onClick={() => handleShowBookings(cab)}
                    >
                      <i className="bi bi-calendar-check me-1"></i> Bookings
                    </button>
                    <button
                      className="btn btn-outline-primary btn-xs d-flex align-items-center px-2 py-1"
                      style={{ fontSize: "0.85rem" }}
                      title="Edit Cab"
                      onClick={() => handleEdit(cab)}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-xs d-flex align-items-center px-2 py-1"
                      style={{ fontSize: "0.85rem" }}
                      title="Delete Cab"
                      onClick={() => handleDelete(cab)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && visibleCabs.length === 0 && (
          <p>No cabs match your search.</p>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteCabModal
        show={showDeleteModal}
        cabDetails={selectedCab}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        deleting={deleting}
        message={modalMessage}
      />
      <ViewCabDetailsModal
        show={showCabModal}
        onHide={() => setShowCabModal(false)}
        cab={cabDetails}
      />
      <CabBookingsModal
        show={showBookingsModal}
        onHide={() => setShowBookingsModal(false)}
        bookings={bookings}
        loading={bookingsLoading}
        error={bookingsError}
      />
    </Layout>
  );
};

export default ShowRegisteredCabs;