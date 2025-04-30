import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import LoadingSpinner from "../spinner/LoadingSpinner"; // Import the loading spinner component
import DeleteCabModal from "../modal/DeleteCabModal"; // Import the delete modal component
import { useNavigate } from "react-router-dom";

const ShowRegisteredCabs = () => {
  const navigate = useNavigate();
  const [cabs, setCabs] = useState([]); // State to store all registered cabs
  const [visibleCabs, setVisibleCabs] = useState([]); // State to store currently visible cabs
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [loading, setLoading] = useState(true); // State to show loading indicator
  const [error, setError] = useState(null); // State to handle errors
  const [page, setPage] = useState(1); // Current page for pagination
  const itemsPerPage = 4; // Number of items to load per page
  const [imageLoading, setImageLoading] = useState({}); // State to track image loading
  const [selectedCab, setSelectedCab] = useState(null); // State to store the selected cab for deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control the visibility of the delete modal
  const [deleting, setDeleting] = useState(false); // State to track delete operation progress
  const [modalMessage, setModalMessage] = useState(null); // State to store success or error message

  // Fetch all registered cabs
  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const response = await fetch("https://carbookingservice.onrender.com/api/cab/registration/get/all");
        if (!response.ok) {
          throw new Error("Failed to fetch cabs");
        }
        const data = await response.json();
        setCabs(data.responseData); // Access the cabs from `responseData`
        setVisibleCabs(data.responseData.slice(0, itemsPerPage)); // Load the first page
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
    setVisibleCabs(filtered.slice(0, page * itemsPerPage)); // Reset visible cabs based on search
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
    navigate(`/edit-cab/${cab.registrationId}`, { state: { cab } }); // Pass cab data via state
  };

  const handleDelete = (cab) => {
    setSelectedCab(cab);
    setShowDeleteModal(true);
    setModalMessage(null); // Clear any previous message
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `https://carbookingservice.onrender.com/api/cab/registration/delete/${selectedCab.registrationId}`,
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

  const handleActivate = (cabId) => {
    alert(`Activate cab with ID: ${cabId}`);
    // Add your activate logic here
  };

  const handleDeactivate = (cabId) => {
    alert(`Deactivate cab with ID: ${cabId}`);
    // Add your deactivate logic here
  };

  return (
    <Layout>
      <div
        className="container mt-4 overflow-auto position-relative"
        style={{ maxHeight: "80vh" }}
        onScroll={handleScroll} // Attach scroll event
      >
        <h1 className="mb-4">Registered Cabs</h1>

        {/* Search Bar */}
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control border-dark" // Added border-dark for black border
            placeholder="Search by cab name, owner, driver, cab number, or type..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="input-group-text border-dark"> {/* Added border-dark for black border */}
            <i className="bi bi-search"></i> {/* Bootstrap search icon */}
          </span>
        </div>

        {/* Loading Spinner Below the Search Box */}
        {loading && <LoadingSpinner />}

        {/* Show error message */}
        {error && <p className="text-danger">{error}</p>}

        {/* Show cabs in a card layout */}
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
                      style={{ height: "200px", objectFit: "cover" }}
                      onLoad={() => handleImageLoad(cab.registrationId)}
                      onError={() => handleImageError(cab.registrationId)}
                      onLoadStart={() =>
                        setImageLoading((prev) => ({ ...prev, [cab.registrationId]: true }))
                      }
                    />
                  </div>
                  <div className="card-body flex-grow-1">
                    <h5 className="card-title">{cab.cab.cabName}</h5>
                    <p className="card-text">
                      <strong>Registration ID:</strong> {cab.registrationId} <br />
                      <strong>Owner:</strong> {cab.ownerName} <br />
                      <strong>Driver:</strong> {cab.driverName} <br />
                      <strong>Contact:</strong> {cab.driverContact} <br />
                      <strong>License:</strong> {cab.driverLicense} <br />
                      <strong>Address:</strong> {cab.address} <br />
                      <strong>Type:</strong> {cab.cab.cabType} <br />
                      <strong>Number:</strong> {cab.cab.cabNumber} <br />
                      <strong>Model:</strong> {cab.cab.cabModel} <br />
                      <strong>Color:</strong> {cab.cab.cabColor} <br />
                      <strong>Capacity:</strong> {cab.cab.cabCapacity} <br />
                      <strong>Insurance:</strong> {cab.cab.cabInsurance} <br />
                      <strong>City:</strong> {cab.cab.cabCity} <br />
                      <strong>State:</strong> {cab.cab.cabState} <br />
                      <strong>Per Km Rate:</strong> ₹{cab.perKmRate} <br />
                      <strong>Base Fare:</strong> ₹{cab.baseFare} <br />
                      <strong>Status:</strong> {cab.status}
                    </p>
                  </div>
                  <div className="card-footer d-flex justify-content-between">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(cab)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(cab)}
                    >
                      Delete
                    </button>
                    {cab.status === "Active" ? (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleDeactivate(cab.registrationId)}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleActivate(cab.registrationId)}
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show message if no cabs match the search */}
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
        message={modalMessage} // Pass the message to the modal
      />
    </Layout>
  );
};

export default ShowRegisteredCabs;