import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const handleMenuClick = (menuId) => {
    const menu = document.getElementById(menuId);
    if (menu.classList.contains("show")) {
      menu.classList.remove("show"); // Close the menu
    } else {
      menu.classList.add("show"); // Open the menu
    }
  };

  return (
    <>
      {/* Offcanvas Sidebar for Mobile */}
      <div
        className="offcanvas offcanvas-start bg-dark text-white"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileSidebarLabel">
            Dashboard
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav nav-pills flex-column mb-auto">
            {/* Users Menu */}
            <li>
              <Link
                to="#"
                className="nav-link text-white d-flex align-items-center"
                onClick={() => handleMenuClick("usersMenu")}
              >
                <i className="fa fa-users me-2"></i>
                <span>Users</span>
              </Link>
              <ul className="collapse list-unstyled ps-3" id="usersMenu">
                <li>
                  <Link to="/users" className="nav-link text-white">
                    <i className="fa fa-eye me-2"></i> Show Users
                  </Link>
                </li>
              </ul>
            </li>

            {/* Cab Management Menu */}
            <li>
              <Link
                to="#"
                className="nav-link text-white d-flex align-items-center"
                onClick={() => handleMenuClick("cabManagementMenu")}
              >
                <i className="fa fa-car me-2"></i>
                <span>Cab Management</span>
              </Link>
              <ul className="collapse list-unstyled ps-3" id="cabManagementMenu">
                <li>
                  <Link to="/register-cab" className="nav-link text-white">
                    <i className="fa fa-plus-circle me-2"></i> Register Cab
                  </Link>
                </li>
                <li>
                  <Link to="/show-cabs" className="nav-link text-white">
                    <i className="fa fa-list me-2"></i> Show Cabs
                  </Link>
                </li>
                <li>
                  <Link to="/cab-reports" className="nav-link text-white">
                    <i className="fa fa-chart-bar me-2"></i> Cab Reports
                  </Link>
                </li>
              </ul>
            </li>

            {/* Settings Menu */}
            <li>
              <Link
                to="#"
                className="nav-link text-white d-flex align-items-center"
                onClick={() => handleMenuClick("settingsMenu")}
              >
                <i className="fa fa-cogs me-2"></i>
                <span>Settings</span>
              </Link>
              <ul className="collapse list-unstyled ps-3" id="settingsMenu">
                <li>
                  <Link to="/profile-settings" className="nav-link text-white">
                    <i className="fa fa-user-circle me-2"></i> Profile Settings
                  </Link>
                </li>
                <li>
                  <Link to="/account-settings" className="nav-link text-white">
                    <i className="fa fa-user-cog me-2"></i> Account Settings
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Sidebar for Desktop */}
      <div
        className="d-none d-md-flex flex-column flex-shrink-0 p-3 bg-dark text-white"
        style={{
          width: "250px",
          height: "100vh",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)", // Add shadow for better visibility
        }}
      >
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          {/* Users Menu */}
          <li>
            <Link
              to="#"
              className="nav-link text-white d-flex align-items-center"
              onClick={() => handleMenuClick("usersMenuDesktop")}
            >
              <i className="fa fa-users me-2"></i>
              <span>Users</span>
            </Link>
            <ul className="collapse list-unstyled ps-3" id="usersMenuDesktop">
              <li>
                <Link to="/users" className="nav-link text-white">
                  <i className="fa fa-eye me-2"></i> Show Users
                </Link>
              </li>
            </ul>
          </li>

          {/* Cab Management Menu */}
          <li>
            <Link
              to="#"
              className="nav-link text-white d-flex align-items-center"
              onClick={() => handleMenuClick("cabManagementMenuDesktop")}
            >
              <i className="fa fa-car me-2"></i>
              <span>Cab Management</span>
            </Link>
            <ul
              className="collapse list-unstyled ps-3"
              id="cabManagementMenuDesktop"
            >
              <li>
                <Link to="/register-cab" className="nav-link text-white">
                  <i className="fa fa-plus-circle me-2"></i> Register Cab
                </Link>
              </li>
              <li>
                <Link to="/show-cabs" className="nav-link text-white">
                  <i className="fa fa-list me-2"></i> Show Cabs
                </Link>
              </li>
              <li>
                <Link to="/cab-reports" className="nav-link text-white">
                  <i className="fa fa-chart-bar me-2"></i> Cab Reports
                </Link>
              </li>
            </ul>
          </li>

          {/* Settings Menu */}
          <li>
            <Link
              to="#"
              className="nav-link text-white d-flex align-items-center"
              onClick={() => handleMenuClick("settingsMenuDesktop")}
            >
              <i className="fa fa-cogs me-2"></i>
              <span>Settings</span>
            </Link>
            <ul
              className="collapse list-unstyled ps-3"
              id="settingsMenuDesktop"
            >
              <li>
                <Link to="/profile-settings" className="nav-link text-white">
                  <i className="fa fa-user-circle me-2"></i> Profile Settings
                </Link>
              </li>
              <li>
                <Link to="/account-settings" className="nav-link text-white">
                  <i className="fa fa-user-cog me-2"></i> Account Settings
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;