import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_ENDPOINTS from "../config/apiConfig";
import CabSelectModal from "../modal/CabSelectModal";

const ModifyBookingModal = ({ show, onHide, booking, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fareCalculating] = useState(false);
  const [fareCalculated, setFareCalculated] = useState(false);
  const [availableCabs, setAvailableCabs] = useState([]);
  const [showCabSelectModal, setShowCabSelectModal] = useState(false);
  const [cabLoading, setCabLoading] = useState(false);

  // Refs for Google Places Autocomplete
  const pickupRef = useRef(null);
  const dropRef = useRef(null);
  useEffect(() => {
    if (booking && show) {
      setFormData(booking);
      setFareCalculated(false);
      setShowCabSelectModal(false);
    }
  }, [booking, show]);

  // Re-initialize autocomplete when the modal is opened
  useEffect(() => {
    if (show && window.google && pickupRef.current && dropRef.current) {
      // Initialize Google Places Autocomplete for Pickup Location
      const pickupAutocomplete = new window.google.maps.places.Autocomplete(
        pickupRef.current,
        {
          types: ["geocode"], // Restrict to geocoded addresses
          componentRestrictions: { country: "in" }, // Restrict to India
        }
      );
      pickupAutocomplete.addListener("place_changed", () => {
        const place = pickupAutocomplete.getPlace();
        setFormData((prevData) => ({
          ...prevData,
          pickupLocation: place.formatted_address,
        }));
      });

      // Initialize Google Places Autocomplete for Drop Location
      const dropAutocomplete = new window.google.maps.places.Autocomplete(
        dropRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "in" },
        }
      );
      dropAutocomplete.addListener("place_changed", () => {
        const place = dropAutocomplete.getPlace();
        setFormData((prevData) => ({
          ...prevData,
          dropLocation: place.formatted_address,
        }));
      });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: (name === "pickupDateTime" || name === "dropDateTime") ? ensureSeconds(value) : value,
    }));
  };

  const handleCalculateFare = async () => {
    setCabLoading(true);
    setError(null);
    try {
      const payload = {
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        pickupDateTime: formData.pickupDateTime,
        dropDateTime: formData.dropDateTime,
        radius: 15,
      };
      const response = await axios.post(API_ENDPOINTS.SEARCH_AVAILABLE_CABS, payload);
      if (response.data.responseCode === 200 && Array.isArray(response.data.responseData)) {
        setAvailableCabs(response.data.responseData);
        setShowCabSelectModal(true);
      } else {
        setError(response.data.responseMessage || "No cabs found.");
      }
    } catch (err) {
      setError("An error occurred while searching cabs.");
    } finally {
      setCabLoading(false);
    }
  };

  const handleSelectCab = (cab) => {
    // Ensure promoDiscount is 0 if null/undefined
    const promoDiscount = cab.promoDiscount == null ? 0 : cab.promoDiscount;
    const tokenAmount = cab.tokenAmount == null ? 0 : cab.tokenAmount;
    const fare = cab.fare == null ? 0 : cab.fare;
    const balanceAmount = fare - promoDiscount - tokenAmount;

    setFormData((prev) => ({
      ...prev,
      cabRegistrationId: cab.cabRegistrationId,
      fare: fare,
      balanceAmount: balanceAmount,
    }));
    setShowCabSelectModal(false);
    setFareCalculated(true);
  };

  function ensureSeconds(datetimeStr) {
    if (!datetimeStr) return "";
    // If already has seconds, return as is
    if (datetimeStr.length === 19) return datetimeStr;
    // If format is 'YYYY-MM-DDTHH:mm', add ':00'
    if (datetimeStr.length === 16) return datetimeStr + ":00";
    return datetimeStr;
  }

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const requestPayload = {
        bookingId: booking.bookingId,
        userId: booking.userId,
        cabRegistrationId: formData.cabRegistrationId,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        pickupDateTime: ensureSeconds(formData.pickupDateTime),
        dropDateTime: ensureSeconds(formData.dropDateTime),
        fare: formData.fare,
        promoDiscount: formData.promoDiscount,
        tokenAmount: formData.tokenAmount,
        balanceAmount: formData.balanceAmount,
        bookingStatus: formData.bookingStatus,
        paymentDetails: formData.paymentDetails || {
          paymentMethod: booking.paymentMethod,
          transactionId: booking.transactionId,
          transactionDate: booking.transactionDate,
          amount: booking.amount,
          status: booking.status,
        },
      };

      const response = await axios.put(
        API_ENDPOINTS.UPDATE_BOOKING(booking.bookingId),
        requestPayload
      );

      if (response.data.responseCode === 200) {
        onSave(formData);

      } else {
        setError(response.data.responseMessage || "Failed to update booking.");
      }
    } catch (err) {
      setError("An error occurred while updating the booking.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Modify Booking # {formData.bookingId}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* Success Message */}
            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {success}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccess(null)}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError(null)}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {booking ? (
              <form>
                {/* Hidden Fields */}
                <input
                  type="hidden"
                  name="bookingId"
                  value={formData.bookingId || ""}
                />
                <input
                  type="hidden"
                  name="userId"
                  value={formData.userId || ""}
                />

                {/* Cab Registration ID */}
                <h6 className="text-primary mb-3">Cab Details</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cabRegistrationId" className="form-label">
                      Cab Registration ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cabRegistrationId"
                      name="cabRegistrationId"
                      value={formData.cabRegistrationId || ""}
                      readOnly
                    />
                  </div>
                </div>

                {/* Location Details Section */}
                <h6 className="text-primary mb-3">Location Details</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="pickupLocation" className="form-label">
                      Pickup Location
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="pickupLocation"
                        name="pickupLocation"
                        ref={pickupRef} 
                        value={formData.pickupLocation || ""} 
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setFormData((prevData) => ({
                            ...prevData,
                            pickupLocation: "",
                          }));
                          // Re-initialize Google Places Autocomplete
                          if (pickupRef.current) {
                            new window.google.maps.places.Autocomplete(pickupRef.current, {
                              types: ["geocode"],
                              componentRestrictions: { country: "in" },
                            });
                          }
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="dropLocation" className="form-label">
                      Drop Location
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="dropLocation"
                        name="dropLocation"
                        ref={dropRef} // Attach ref for Google Places Autocomplete
                        value={formData.dropLocation || ""} // Use value instead of defaultValue
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setFormData((prevData) => ({
                            ...prevData,
                            dropLocation: "",
                          }));
                          // Re-initialize Google Places Autocomplete
                          if (dropRef.current) {
                            new window.google.maps.places.Autocomplete(dropRef.current, {
                              types: ["geocode"],
                              componentRestrictions: { country: "in" },
                            });
                          }
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>

                {/* Date & Time Section */}
                <h6 className="text-primary mb-3">Date & Time</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="pickupDateTime" className="form-label">
                      Pickup Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="pickupDateTime"
                      name="pickupDateTime"
                      value={formData.pickupDateTime || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="dropDateTime" className="form-label">
                      Drop Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="dropDateTime"
                      name="dropDateTime"
                      value={formData.dropDateTime || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Payment Details Section */}
                <h6 className="text-primary mb-3">Fare Details</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="fare" className="form-label">
                      Fare (₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="fare"
                      name="fare"
                      value={formData.fare || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="promoDiscount" className="form-label">
                      Promo Discount (₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="promoDiscount"
                      name="promoDiscount"
                      value={formData.promoDiscount == null ? 0 : formData.promoDiscount}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="tokenAmount" className="form-label">
                      Token Amount (₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="tokenAmount"
                      name="tokenAmount"
                      value={formData.tokenAmount || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="balanceAmount" className="form-label">
                      Balance Amount (₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="balanceAmount"
                      name="balanceAmount"
                      value={
                        (formData.fare || 0) -
                        (formData.promoDiscount == null ? 0 : formData.promoDiscount) -
                        (formData.tokenAmount == null ? 0 : formData.tokenAmount)
                      }
                      readOnly
                    />
                  </div>
                </div>
              </form>
            ) : (
              <p className="text-danger">Booking details not available.</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
              disabled={loading || fareCalculating}
            >
              Close
            </button>
            {/* Calculate Fare Button */}
            {!fareCalculated && (
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleCalculateFare}
                disabled={cabLoading || loading}
              >
                {cabLoading ? "Calculating..." : "Calculate Fare"}
              </button>
            )}
            {/* Save Changes Button */}
            {fareCalculated && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading || !formData.cabRegistrationId}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            )}

            <CabSelectModal
              show={showCabSelectModal}
              cabs={availableCabs}
              loading={cabLoading}
              onSelect={handleSelectCab}
              onHide={() => setShowCabSelectModal(false)}
              currentCabRegistrationId={formData.cabRegistrationId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyBookingModal;