import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const HeaderBar = () => {
  const userName = localStorage.getItem("name");
  const firstName = userName ? userName.split(" ")[0] : "";
  const imageUrl = localStorage.getItem("imageUrl");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("authToken");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100%",
        zIndex: 1030,
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Subtle shadow for modern look
      }}
    >
      <div className="container-fluid">
        {/* Sidebar Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
          aria-controls="mobileSidebar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Brand */}
        <a className="navbar-brand" href="/index">
        <img
          src={require("../../assets/logo.png")} // Correct relative path
          alt="YatraNow Logo"
          style={{ height: "40px" }}
        />
      </a>

        {/* Navbar Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Navbar for Desktop */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Notifications */}
            <li className="nav-item dropdown">
              <button
                className="btn btn-outline-light position-relative"
                id="notificationsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  borderRadius: "50%",
                  padding: "0.5rem",
                  width: "40px",
                  height: "40px",
                }}
              >
                <i className="bi bi-bell"></i>
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.6rem" }}
                >
                  3
                </span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="notificationsDropdown"
                style={{
                  backgroundColor: "#2c2f33",
                  border: "none",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                  width: "350px",
                  padding: "0",
                }}
              >
                <li className="dropdown-header text-white fw-bold py-3 px-4" style={{ borderBottom: "1px solid #444" }}>
                  Notifications
                </li>
                <li>
                  <div
                    className="dropdown-item d-flex align-items-start text-white py-3 px-4"
                    style={{
                      backgroundColor: "transparent",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#3a3d42")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                  >
                    <i className="bi bi-calendar-check me-3 text-success fs-4"></i>
                    <div>
                      <span className="fw-semibold">New booking: John Doe</span>
                      <small className="d-block text-muted">Pickup at 10:30 AM</small>
                      <small className="d-block text-muted">5 mins ago</small>
                    </div>
                  </div>
                </li>
                <li>
                  <div
                    className="dropdown-item d-flex align-items-start text-white py-3 px-4"
                    style={{
                      backgroundColor: "transparent",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#3a3d42")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                  >
                    <i className="bi bi-person-plus me-3 text-info fs-4"></i>
                    <div>
                      <span className="fw-semibold">Driver registration request</span>
                      <small className="d-block text-muted">Jane Smith</small>
                      <small className="d-block text-muted">10 mins ago</small>
                    </div>
                  </div>
                </li>
                <li>
                  <div
                    className="dropdown-item d-flex align-items-start text-white py-3 px-4"
                    style={{
                      backgroundColor: "transparent",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#3a3d42")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                  >
                    <i className="bi bi-cash-coin me-3 text-warning fs-4"></i>
                    <div>
                      <span className="fw-semibold">Payment received</span>
                      <small className="d-block text-muted">$50 for Booking #12345</small>
                      <small className="d-block text-muted">15 mins ago</small>
                    </div>
                  </div>
                </li>
                <li>
                  <hr className="dropdown-divider" style={{ borderColor: "#444", margin: "0" }} />
                </li>
                <li>
                  <button
                    className="dropdown-item text-center text-white fw-bold py-3"
                    type="button"
                    style={{
                      backgroundColor: "transparent",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#3a3d42")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                  >
                    View All Notifications
                  </button>
                </li>
              </ul>
            </li>

            {/* Profile Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="btn nav-link dropdown-toggle d-flex align-items-center"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                <img
                  src={imageUrl}
                  alt="User"
                  className="rounded-circle me-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "2px solid #fff",
                  }}
                />
                <span className="text-white fw-semibold">{firstName}</span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="profileDropdown"
                style={{
                  backgroundColor: "#343a40",
                  border: "none",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                <li>
                  <button
                    className="dropdown-item text-white"
                    type="button"
                    style={{
                      backgroundColor: "transparent",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#495057")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    onClick={() => navigate("/profile-settings")}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-white"
                    type="button"
                    style={{
                      backgroundColor: "transparent",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#495057")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    onClick={() => navigate("/account-settings")}
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" style={{ borderColor: "#6c757d" }} />
                </li>
                <li>
                  <button
                    className="dropdown-item text-white"
                    type="button"
                    style={{
                      backgroundColor: "transparent",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#495057")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderBar;