import React from "react";
import HeaderBar from "../navigation/HeaderBar";
import Sidebar from "../navigation/sidebar";

const Layout = ({ children }) => {
  return (
    <div className="container-fluid p-0">
      {/* Header Bar */}
      <HeaderBar />

      <div className="row" style={{ marginTop: "56px" }}> {/* Adjust margin to match HeaderBar height */}
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 p-0 bg-dark">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4" style={{ height: "calc(100vh - 56px)", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;