import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Layout from "../layout/Layout";
import API_ENDPOINTS from "../config/apiConfig";
import { FaPlus, FaEdit } from "react-icons/fa"; // Add this for better icons

const UserOffers = () => {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    id: 0,
    promocode: "",
    description: "",
    discount: "",
    minFare: "",
    discountPercentage: "",
    maxDiscount: "",
    state: "",
    city: "",
    promoStartDate: "",
    promoEndDate: "",
  });
  const [editOffer, setEditOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [offersPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Fetch offers from the API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.ALL_OFFERS);
        setOffers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching offers:", error);
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Sorting logic
  const sortedOffers = useMemo(() => {
    let sortableOffers = [...offers];
    if (sortConfig.key) {
      sortableOffers.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        // For string comparison, ignore case
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableOffers;
  }, [offers, sortConfig]);

  // Pagination logic
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = sortedOffers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(sortedOffers.length / offersPerPage);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editOffer) {
      let updated = { ...editOffer, [name]: value };
      if (name === "discount") {
        if (parseFloat(value) > 0) {
          updated.discountPercentage = 0;
          updated.maxDiscount = 0;
        }
      }
      setEditOffer(updated);
    } else {
      let updated = { ...newOffer, [name]: value };
      if (name === "discount") {
        if (parseFloat(value) > 0) {
          updated.discountPercentage = 0;
          updated.maxDiscount = 0;
        }
      }
      setNewOffer(updated);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editOffer) {
        const updatedOffer = {
          ...editOffer,
          discount: parseFloat(editOffer.discount) || 0,
          minFare: parseFloat(editOffer.minFare) || 0,
          discountPercentage: parseFloat(editOffer.discountPercentage) || 0,
          maxDiscount: parseFloat(editOffer.maxDiscount) || 0,
          promoStartDate: new Date(editOffer.promoStartDate).toISOString(),
          promoEndDate: new Date(editOffer.promoEndDate).toISOString(),
        };
        await axios.put(API_ENDPOINTS.UPDATE_OFFER(editOffer.id), updatedOffer);
        setOffers(
          offers.map((offer) =>
            offer.id === editOffer.id ? updatedOffer : offer
          )
        );
        setEditOffer(null);
        setModalMessage("Offer updated successfully!");
      } else {
        const newOfferPayload = {
          ...newOffer,
          discount: parseFloat(newOffer.discount) || 0,
          minFare: parseFloat(newOffer.minFare) || 0,
          discountPercentage: parseFloat(newOffer.discountPercentage) || 0,
          maxDiscount: parseFloat(newOffer.maxDiscount) || 0,
          promoStartDate: new Date(newOffer.promoStartDate).toISOString(),
          promoEndDate: new Date(newOffer.promoEndDate).toISOString(),
        };
        const response = await axios.post(
          API_ENDPOINTS.ADD_OFFER,
          newOfferPayload
        );
        setOffers([...offers, response.data]);
        setNewOffer({
          id: 0,
          promocode: "",
          description: "",
          discount: "",
          minFare: "",
          discountPercentage: "",
          maxDiscount: "",
          state: "",
          city: "",
          promoStartDate: "",
          promoEndDate: "",
        });
        setModalMessage("Offer added successfully!");
      }
    } catch (error) {
      console.error("Error saving offer:", error);
      setModalMessage("Failed to save offer. Please try again.");
    } finally {
      setFormLoading(false);
      setIsModalVisible(true);
    }
  };

  return (
    <Layout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-warning mb-0">Exclusive Offers</h2>
          {/* Floating Add Button */}
          <button
            className="btn btn-warning rounded-circle shadow"
            style={{ width: 48, height: 48, fontSize: 22 }}
            data-bs-toggle="modal"
            data-bs-target="#offerModal"
            onClick={() => setEditOffer(null)}
            title="Add Offer"
          >
            <FaPlus />
          </button>
        </div>

        {/* Offers Table */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
              </div>
            ) : sortedOffers.length === 0 ? (
              <div className="text-center py-5 text-muted">No offers found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-warning">
                    <tr>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("promocode")}>
                        Promo Code {sortConfig.key === "promocode" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("description")}>
                        Description {sortConfig.key === "description" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("discount")}>
                        Discount (₹) {sortConfig.key === "discount" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("minFare")}>
                        Min Fare (₹) {sortConfig.key === "minFare" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("discountPercentage")}>
                        Discount % {sortConfig.key === "discountPercentage" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("maxDiscount")}>
                        Max Discount (₹) {sortConfig.key === "maxDiscount" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("state")}>
                        State {sortConfig.key === "state" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("city")}>
                        City {sortConfig.key === "city" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("promoStartDate")}>
                        Start {sortConfig.key === "promoStartDate" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("promoEndDate")}>
                        End {sortConfig.key === "promoEndDate" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th style={{ width: 60 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOffers.map((offer) => (
                      <tr key={offer.id}>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {offer.promocode}
                          </span>
                        </td>
                        <td>{offer.description}</td>
                        <td>{offer.discount}</td>
                        <td>{offer.minFare}</td>
                        <td>{offer.discountPercentage}</td>
                        <td>{offer.maxDiscount}</td>
                        <td>{offer.state}</td>
                        <td>{offer.city}</td>
                        <td>
                          {offer.promoStartDate
                            ? new Date(offer.promoStartDate).toLocaleDateString()
                            : ""}
                        </td>
                        <td>
                          {offer.promoEndDate
                            ? new Date(offer.promoEndDate).toLocaleDateString()
                            : ""}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#offerModal"
                            onClick={() => setEditOffer(offer)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav className="mt-3">
                <ul className="pagination justify-content-center mb-0">
                  <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, idx) => (
                    <li
                      key={idx + 1}
                      className={`page-item${currentPage === idx + 1 ? " active" : ""}`}
                    >
                      <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>
                        {idx + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>

        {/* Add/Edit Offer Modal */}
        <div
          className="modal fade"
          id="offerModal"
          tabIndex="-1"
          aria-labelledby="offerModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-warning bg-opacity-10 border-0">
                <h5 className="modal-title" id="offerModalLabel">
                  {editOffer ? "Edit Offer" : "Add New Offer"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Promo Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="promocode"
                        value={editOffer ? editOffer.promocode : newOffer.promocode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-control"
                        name="description"
                        value={
                          editOffer ? editOffer.description : newOffer.description
                        }
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Discount (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="discount"
                        value={editOffer ? editOffer.discount : newOffer.discount}
                        onChange={handleChange}
                        min={0}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Min Fare (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="minFare"
                        value={editOffer ? editOffer.minFare : newOffer.minFare}
                        onChange={handleChange}
                        min={0}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Discount %</label>
                      <input
                        type="number"
                        className="form-control"
                        name="discountPercentage"
                        value={
                          editOffer
                            ? editOffer.discountPercentage
                            : newOffer.discountPercentage
                        }
                        onChange={handleChange}
                        min={0}
                        max={100}
                        required
                        disabled={
                          editOffer
                            ? parseFloat(editOffer.discount) > 0
                            : parseFloat(newOffer.discount) > 0
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Max Discount (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="maxDiscount"
                        value={editOffer ? editOffer.maxDiscount : newOffer.maxDiscount}
                        onChange={handleChange}
                        min={0}
                        required
                        disabled={
                          editOffer
                            ? parseFloat(editOffer.discount) > 0
                            : parseFloat(newOffer.discount) > 0
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={editOffer ? editOffer.state : newOffer.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={editOffer ? editOffer.city : newOffer.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="promoStartDate"
                        value={
                          editOffer
                            ? new Date(editOffer.promoStartDate).toISOString().split("T")[0]
                            : newOffer.promoStartDate
                        }
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="promoEndDate"
                        value={
                          editOffer
                            ? new Date(editOffer.promoEndDate).toISOString().split("T")[0]
                            : newOffer.promoEndDate
                        }
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-warning w-100 mt-4"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <span>
                        <i className="fa fa-spinner fa-spin me-2"></i> Saving...
                      </span>
                    ) : editOffer ? (
                      "Update Offer"
                    ) : (
                      "Add Offer"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        {isModalVisible && (
          <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-warning bg-opacity-10 border-0">
                  <h5 className="modal-title">Notification</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsModalVisible(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{modalMessage}</p>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => setIsModalVisible(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserOffers;