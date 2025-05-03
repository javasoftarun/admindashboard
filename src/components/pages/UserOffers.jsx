import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout/Layout";

const UserOffers = () => {
  const [offers, setOffers] = useState([]); // State to store offers
  const [newOffer, setNewOffer] = useState({
    id: 0,
    title: "",
    state: "",
    city: "",
    percentage: "",
    promocode: "",
    restriction: "",
    promoStartDate: "",
    promoEndDate: "",
  });
  const [editOffer, setEditOffer] = useState(null); // State for editing an offer
  const [loading, setLoading] = useState(false); // Loading state for fetching offers
  const [formLoading, setFormLoading] = useState(false); // Loading state for form submission
  const [modalMessage, setModalMessage] = useState(""); // Message for feedback modal
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  // Fetch offers from the API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://commonservice.onrender.com/api/common/offer/all");
        setOffers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching offers:", error);
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editOffer) {
      setEditOffer({ ...editOffer, [name]: value });
    } else {
      setNewOffer({ ...newOffer, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true); // Start form loading
    try {
      if (editOffer) {
        // Update existing offer
        const updatedOffer = {
          ...editOffer,
          promoStartDate: new Date(editOffer.promoStartDate).toISOString(),
          promoEndDate: new Date(editOffer.promoEndDate).toISOString(),
        };
        await axios.put(
          `https://commonservice.onrender.com/api/common/offer/update/${editOffer.id}`,
          updatedOffer
        );
        setOffers(
          offers.map((offer) =>
            offer.id === editOffer.id ? updatedOffer : offer
          )
        );
        setEditOffer(null);
        setModalMessage("Offer updated successfully!");
      } else {
        // Add new offer
        const newOfferPayload = {
          ...newOffer,
          promoStartDate: new Date(newOffer.promoStartDate).toISOString(),
          promoEndDate: new Date(newOffer.promoEndDate).toISOString(),
        };
        const response = await axios.post(
          "https://commonservice.onrender.com/api/common/offer/create",
          newOfferPayload
        );
        setOffers([...offers, response.data]);
        setNewOffer({
          id: 0,
          title: "",
          state: "",
          city: "",
          percentage: "",
          promocode: "",
          restriction: "",
          promoStartDate: "",
          promoEndDate: "",
        });
        setModalMessage("Offer added successfully!");
      }
    } catch (error) {
      console.error("Error saving offer:", error);
      setModalMessage("Failed to save offer. Please try again.");
    } finally {
      setFormLoading(false); // Stop form loading
      setIsModalVisible(true); // Show feedback modal
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h1 className="mb-4 text-center text-warning">Exclusive Offers</h1>

        {/* Add Offer Button */}
        <div className="text-end mb-3">
          <button
            className="btn btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#offerModal"
            onClick={() => setEditOffer(null)} // Reset editOffer for new offer
          >
            <i className="fa fa-plus me-2"></i> Add Offer
          </button>
        </div>

        {/* Offers List */}
        {loading ? (
          <p>Loading offers...</p>
        ) : (
          <div className="row">
            {offers.map((offer) => (
              <div key={offer.id} className="col-md-4 mb-4">
                <div className="card border-warning shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-warning">{offer.title}</h5>
                    <p className="card-text">
                      <strong>Id:</strong> {offer.id} <br />
                      <strong>State:</strong> {offer.state} <br />
                      <strong>City:</strong> {offer.city} <br />
                      <strong>Percentage:</strong> {offer.percentage} <br />
                      <strong>Promo Code:</strong> {offer.promocode} <br />
                      <strong>Restriction:</strong> {offer.restriction} <br />
                      <strong>Start Date:</strong> {offer.promoStartDate} <br />
                      <strong>End Date:</strong> {offer.promoEndDate}
                    </p>
                    <div className="text-end">
                      <button
                        className="btn btn-sm btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#offerModal"
                        onClick={() => setEditOffer(offer)} // Set offer to edit
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Offer Modal */}
        <div
          className="modal fade"
          id="offerModal"
          tabIndex="-1"
          aria-labelledby="offerModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
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
                  <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Offer Title
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          name="title"
                          value={editOffer ? editOffer.title : newOffer.title}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="state" className="form-label">
                          State
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="state"
                          name="state"
                          value={editOffer ? editOffer.state : newOffer.state}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="city" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          name="city"
                          value={editOffer ? editOffer.city : newOffer.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="percentage" className="form-label">
                          Percentage
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="percentage"
                          name="percentage"
                          value={
                            editOffer ? editOffer.percentage : newOffer.percentage
                          }
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="promocode" className="form-label">
                          Promo Code
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="promocode"
                          name="promocode"
                          value={
                            editOffer ? editOffer.promocode : newOffer.promocode
                          }
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="restriction" className="form-label">
                          Restriction
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="restriction"
                          name="restriction"
                          value={
                            editOffer
                              ? editOffer.restriction
                              : newOffer.restriction
                          }
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="promoStartDate" className="form-label">
                          Promo Start Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="promoStartDate"
                          name="promoStartDate"
                          value={
                            editOffer
                              ? new Date(editOffer.promoStartDate)
                                  .toISOString()
                                  .split("T")[0]
                              : newOffer.promoStartDate
                          }
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="promoEndDate" className="form-label">
                          Promo End Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="promoEndDate"
                          name="promoEndDate"
                          value={
                            editOffer
                              ? new Date(editOffer.promoEndDate)
                                  .toISOString()
                                  .split("T")[0]
                              : newOffer.promoEndDate
                          }
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-warning w-100"
                    disabled={formLoading} // Disable button while loading
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
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
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
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
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