import React from "react";
import HeaderBar from "../navigation/HeaderBar";
import Sidebar from "../navigation/sidebar";

const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <HeaderBar />

        {/* Content */}
        <div
          className="container-fluid"
          style={{
            marginTop: "76px",
            paddingLeft: "15px",
            paddingRight: "15px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};


export default Layout;