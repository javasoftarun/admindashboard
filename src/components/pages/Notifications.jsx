import React from "react";
import Layout from "../layout/Layout";

const Notifications = () => {
  // Example notifications data
  const notifications = [
    {
      id: 1,
      type: "Booking",
      message: "New booking: Arun Maurya",
      timestamp: "2025-05-01 10:30 AM",
    },
    {
      id: 2,
      type: "Driver",
      message: "Driver registration request: Abhi Kumar",
      timestamp: "2025-05-02 02:15 PM",
    },
    {
      id: 3,
      type: "Payment",
      message: "Payment received: Rs.50 for Booking #12345",
      timestamp: "2025-05-03 09:45 AM",
    },
  ];

  return (
    <Layout>
    <div className="container mt-4">
      <h1 className="mb-4 text-center text-warning">Notifications</h1>
      <div className="list-group">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <div>
              <h5 className="mb-1">{notification.type}</h5>
              <p className="mb-1">{notification.message}</p>
              <small className="text-muted">{notification.timestamp}</small>
            </div>
            <span
              className={`badge ${
                notification.type === "Booking"
                  ? "bg-success"
                  : notification.type === "Driver"
                  ? "bg-info"
                  : "bg-warning"
              }`}
            >
              {notification.type}
            </span>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
};

export default Notifications;