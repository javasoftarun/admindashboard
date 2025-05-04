import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Index from "./components/pages/index";
import ShowUsers from "./components/pages/ShowUsers";
import RegisterCab from "./components/pages/RegisterCab";
import ShowRegisteredCabs from "./components/pages/ShowRegisteredCabs";
import EditCab from "./components/pages/EditCab"; // Import the EditCab component
import AdminRegistration from "./components/login/AdminRegistration";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPassword from "./components/login/ForgotPassword";
import ProfileSettings from "./components/pages/ProfileSettings"; 
import AccountSettings from "./components/pages/AccountSettings"; // Import the AccountSettings component
import UserOffers from "./components/pages/UserOffers";
import Notifications from "./components/pages/Notifications";
import Bookings from "./components/pages/Bookings"; // Import the ShowAllBookings component


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register-admin" element={<AdminRegistration />} />
        <Route path="/index" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><ShowUsers /></ProtectedRoute>} /> {/* Added ProtectedRoute for ShowUsers */}
        <Route path="/register-cab" element={<ProtectedRoute><RegisterCab /></ProtectedRoute>} /> {/* Added ProtectedRoute for RegisterCab */}
        <Route path="/show-cabs" element={<ProtectedRoute><ShowRegisteredCabs /></ProtectedRoute>} /> {/* Added ProtectedRoute for ShowRegisteredCabs */}
        <Route path="/edit-cab/:id" element={<ProtectedRoute><EditCab /></ProtectedRoute>} /> {/* Added ProtectedRoute for EditCab */}
        <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
        <Route path="/account-settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        <Route path="/create-user-offers" element={<ProtectedRoute><UserOffers /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;