import React from "react";
import HeaderBar from "../navigation/HeaderBar";
import Sidebar from "../navigation/sidebar";

const Layout = ({ children }) => {
  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <HeaderBar />

        {/* Content */}
        <div
          className="flex-grow-1"
          style={{
            marginTop: "76px", // Adjust for the height of the fixed header
            paddingLeft: "15px",
            paddingRight: "15px",
            overflowY: "auto", 
            overflowX: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;