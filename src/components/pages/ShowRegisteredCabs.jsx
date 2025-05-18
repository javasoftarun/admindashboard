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
  const [filteredCabs, setFilteredCabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("registrationId");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCabs();
  }, []);

  // Filtering and sorting logic
  useEffect(() => {
    let result = [...cabs];

    // Filter by search term
    if (searchTerm) {
      result = result.filter((cab) =>
        cab.cab.cabName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cab.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cab.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cab.cab.cabNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cab.cab.cabType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      result = result.filter((cab) => cab.status === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let aValue, bValue;
      if (sortField === "cabName") {
        aValue = a.cab.cabName.toLowerCase();
        bValue = b.cab.cabName.toLowerCase();
      } else if (sortField === "registrationId") {
        aValue = a.registrationId;
        bValue = b.registrationId;
      } else if (sortField === "status") {
        aValue = a.status;
        bValue = b.status;
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCabs(result);
  }, [cabs, searchTerm, statusFilter, sortField, sortOrder]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle sort field and order
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
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
        setModalMessage({ type: "success", text: "Cab deleted successfully!" });
      } else {
        setModalMessage({ type: "error", text: `Failed to delete cab: ${data.responseMessage}` });
      }
    } catch (error) {
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
      <div className="container mt-4 overflow-auto position-relative">
        <h1 className="mb-4" style={{ color: "#ffc107", fontWeight: 700, letterSpacing: 1 }}>
          <i className="bi bi-truck me-2" style={{ color: "#ffc107" }}></i>
          Registered Cabs
        </h1>

        {/* Filter & Sort Controls */}
        <div className="row mb-3">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control border-warning"
              placeholder="Search by cab name, owner, driver, cab number, or type..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="col-md-3 mb-2">
            <select
              className="form-select border-warning"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="col-md-5 mb-2 d-flex gap-2">
            <button
              className={`btn btn-outline-warning fw-bold ${sortField === "registrationId" ? "active" : ""}`}
              onClick={() => handleSort("registrationId")}
            >
              Reg. ID {sortField === "registrationId" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>
            
          </div>
        </div>

        {loading && <LoadingSpinner />}

        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && filteredCabs.length > 0 && (
          <div className="row">
            {filteredCabs.map((cab, index) => (
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
                  <div className="card-footer bg-white border-0 py-2 px-1">
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      <button
                        className="btn btn-outline-warning btn-xs d-flex align-items-center justify-content-center"
                        style={{ fontSize: "1.1rem", borderColor: "#ffc107", width: 32, height: 32 }}
                        title="View Details"
                        onClick={() => {
                          setCabDetails(cab);
                          setShowCabModal(true);
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-outline-dark btn-xs d-flex align-items-center justify-content-center"
                        style={{ fontSize: "1.1rem", width: 32, height: 32 }}
                        title="View Bookings"
                        onClick={() => handleShowBookings(cab)}
                      >
                        <i className="bi bi-calendar-check"></i>
                      </button>
                      <button
                        className="btn btn-outline-primary btn-xs d-flex align-items-center justify-content-center"
                        style={{ fontSize: "1.1rem", width: 32, height: 32 }}
                        title="Edit Cab"
                        onClick={() => handleEdit(cab)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-xs d-flex align-items-center justify-content-center"
                        style={{ fontSize: "1.1rem", width: 32, height: 32 }}
                        title="Delete Cab"
                        onClick={() => handleDelete(cab)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredCabs.length === 0 && (
          <p>No cabs match your search or filter.</p>
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