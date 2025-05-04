import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderBar = () => {
  const userName = localStorage.getItem("name");
  const firstName = userName ? userName.split(" ")[0] : "";
  const imageUrl = localStorage.getItem("imageUrl");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
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
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
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
            src={require("../../assets/logo.png")}
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
                    onClick={() => navigate("/profile-settings")}
                    style={{
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#007bff")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    User Profile
                  </button>
                </li>

                <li>
                  <button
                    className="dropdown-item text-white"
                    type="button"
                    onClick={handleLogout}
                    style={{
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#007bff")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
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