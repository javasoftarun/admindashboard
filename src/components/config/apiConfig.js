const API_USER_BASE_URL = "https://userservice-zwy2.onrender.com/api";
const API_CABANDBOOKING_BASE_URL = "https://carbookingservice-4ydj.onrender.com/api";
const API_COMMONSERVICE_BASE_URL = "https://commonservice-wxam.onrender.com/api";

const API_ENDPOINTS = {
  // users api endpoints
  LOGIN_API: `${API_USER_BASE_URL}/users/login`,
  FORGOT_PASSWORD: `${API_USER_BASE_URL}/users/forgot-password`,
  RESET_PASSWORD: `${API_USER_BASE_URL}/users/reset-password`,
  GET_ALL_USERS: `${API_USER_BASE_URL}/users/all`,
  GET_USER_BY_ID: (id) => `${API_USER_BASE_URL}/users/${id}`,
  ADD_USER: `${API_USER_BASE_URL}/users/register`,
  DELETE_USER: (id) => `${API_USER_BASE_URL}/users/${id}`,
  UPDATE_PASSWORD: `${API_USER_BASE_URL}/users/update/password`,
  UPDATE_USER: `${API_USER_BASE_URL}/users/update`,

  // cab and booking api endpoints
  GET_ALL_CABS: `${API_CABANDBOOKING_BASE_URL}/cab/registration/get/all`,
  DELETE_CAB: (id) => `${API_CABANDBOOKING_BASE_URL}/cab/registration/delete/${id}`,
  ADD_CAB: `${API_CABANDBOOKING_BASE_URL}/cab/registration/register`,
  GET_CAB_BY_ID: (id) => `${API_CABANDBOOKING_BASE_URL}/cab/registration/get/${id}`,
  UPDATE_CAB: (id) => `${API_CABANDBOOKING_BASE_URL}/cab/registration/update/${id}`,
  GET_ALL_BOOKINGS: `${API_CABANDBOOKING_BASE_URL}/cab/booking/find/all`,
  UPDATE_BOOKING: (id) => `${API_CABANDBOOKING_BASE_URL}/cab/booking/update/${id}`,
  UPDATE_BOOKING_STATUS: `${API_CABANDBOOKING_BASE_URL}/cab/booking/update-booking-status`,
  SEARCH_AVAILABLE_CABS: `${API_CABANDBOOKING_BASE_URL}/cab/registration/search`,
  

  // Common service endpoints
  UPLOAD_BASE64_IMAGE: `${API_COMMONSERVICE_BASE_URL}/common/uploadBase64Image`,
  ALL_OFFERS: `${API_COMMONSERVICE_BASE_URL}/common/offer/all`,
  ADD_OFFER: `${API_COMMONSERVICE_BASE_URL}/common/offer/create`,
  UPDATE_OFFER: (id) => `${API_COMMONSERVICE_BASE_URL}/common/offer/update/${id}`,
  DELETE_OFFER: (id) => `${API_COMMONSERVICE_BASE_URL}/common/offer/delete/${id}`,
};

export default API_ENDPOINTS;