import React from "react";
import HeaderBar from "../navigation/HeaderBar";
import Sidebar from "../navigation/sidebar";

const Layout = ({ children }) => {
  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "auto" }}>
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
            marginTop: "70px",
            paddingLeft: "10px",
            paddingRight: "10px",
            overflowY: "auto", 
            overflowX: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;