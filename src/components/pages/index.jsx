import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import API_ENDPOINTS from "../config/apiConfig";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

const DashboardSkeleton = () => (
  <>
    <div className="row g-3 mb-4">
      {[...Array(6)].map((_, i) => (
        <div className="col-6 col-md-4 col-lg-2" key={i}>
          <Skeleton height={90} borderRadius={12} />
        </div>
      ))}
    </div>
    <div className="row g-4">
      <div className="col-md-6">
        <Skeleton height={300} borderRadius={16} />
      </div>
      <div className="col-md-6">
        <Skeleton height={300} borderRadius={16} />
      </div>
    </div>
    <div className="row mt-4">
      <div className="col-md-12">
        <Skeleton height={60} borderRadius={8} />
      </div>
    </div>
    <div className="row mt-4">
      <div className="col-md-12">
        <Skeleton height={120} borderRadius={8} />
      </div>
    </div>
  </>
);

const Index = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.DASHBOARD_DATA, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setDashboard(data.responseData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setBookingsLoading(true);
    fetch(API_ENDPOINTS.GET_ALL_BOOKINGS, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const bookings = Array.isArray(data.responseData) ? data.responseData : [];
        // Filter out bookings without a valid pickupDateTime
        const validBookings = bookings.filter(
          b => b.pickupDateTime && !isNaN(new Date(b.pickupDateTime).getTime())
        );
        // Sort by pickupDateTime descending
        validBookings.sort(
          (a, b) => new Date(b.pickupDateTime).getTime() - new Date(a.pickupDateTime).getTime()
        );
        setRecentBookings(validBookings.slice(0, 5));
        setBookingsLoading(false);
      })
      .catch(() => setBookingsLoading(false));
  }, []);

  // Fallback values if API is not loaded yet
  const totalUsers = dashboard?.totalUsers ?? 0;
  const totalProfit = dashboard?.totalProfit ?? 0;
  const totalBookings = dashboard?.totalBookings ?? 0;
  const pendingBookings = dashboard?.pendingBookings ?? 0;
  const canceledBookings = dashboard?.canceledBookings ?? 0;
  const totalCabs = dashboard?.totalCabs ?? 0;
  const activeCabs = dashboard?.activeCabs ?? 0;
  const inactiveCabs = dashboard?.inactiveCabs ?? 0;

  // Chart colors
  const yellow = "#ffc107";
  const gray = "#e0e0e0";

  // Bar Chart
  const barChartData = {
    labels: ["Active Cabs", "Inactive Cabs"],
    datasets: [
      {
        label: "Cabs",
        data: [activeCabs, inactiveCabs],
        backgroundColor: [yellow, gray],
        borderRadius: 8,
        maxBarThickness: 40,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Cab Status",
        color: "#b8860b",
        font: { size: 20, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#333",
        font: { weight: "bold", size: 14 },
        formatter: Math.round,
      },
    },
    scales: {
      x: {
        ticks: { color: "#b8860b", font: { weight: "bold" } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#b8860b", font: { weight: "bold" } },
        grid: { color: "#ffe066" },
      },
    },
  };

  // Doughnut Chart
  const doughnutChartData = {
    labels: ["Active Cabs", "Inactive Cabs"],
    datasets: [
      {
        label: "Cab Status",
        data: [activeCabs, inactiveCabs],
        backgroundColor: [yellow, gray],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: { color: "#b8860b", font: { size: 14, weight: "bold" } },
      },
      title: {
        display: true,
        text: "Cab Status Distribution",
        color: "#b8860b",
        font: { size: 20, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      datalabels: {
        color: "#333",
        font: { weight: "bold", size: 16 },
        formatter: (value) => value,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed}`,
        },
      },
    },
  };

  // Example data for latest messages and recent bookings (static for now)
  const latestMessages = [
    { id: 1, user: "John Doe", message: "Booking confirmed for tomorrow." },
    { id: 2, user: "Jane Smith", message: "Can I cancel my booking?" },
    { id: 3, user: "Mike Johnson", message: "Driver was very helpful!" },
  ];

  return (
    <Layout>
      <div className="container mt-4">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Dashboard Summary Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-4 col-lg-2">
                <div className="card shadow-sm text-center" style={{ borderBottom: "4px solid #ffc107" }}>
                  <div className="card-body">
                    <div className="fw-bold text-muted mb-1">Total Users</div>
                    <div className="display-6" style={{ color: "#b8860b" }}>{totalUsers}</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <div className="card shadow-sm text-center" style={{ borderBottom: "4px solid #ffc107" }}>
                  <div className="card-body">
                    <div className="fw-bold text-muted mb-1">Total Profit</div>
                    <div className="display-6" style={{ color: "#b8860b" }}>₹{totalProfit}</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <div className="card shadow-sm text-center" style={{ borderBottom: "4px solid #ffc107" }}>
                  <div className="card-body">
                    <div className="fw-bold text-muted mb-1">Total Bookings</div>
                    <div className="display-6" style={{ color: "#b8860b" }}>{totalBookings}</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <div className="card shadow-sm text-center" style={{ borderBottom: "4px solid #ffc107" }}>
                  <div className="card-body">
                    <div className="fw-bold text-muted mb-1">Pending Bookings</div>
                    <div className="display-6" style={{ color: "#b8860b" }}>{pendingBookings}</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <div className="card shadow-sm text-center" style={{ borderBottom: "4px solid #ffc107" }}>
                  <div className="card-body">
                    <div className="fw-bold text-muted mb-1">Canceled Bookings</div>
                    <div className="display-6" style={{ color: "#b8860b" }}>{canceledBookings}</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <div className="card shadow-sm text-center" style={{ borderBottom: "4px solid #ffc107" }}>
                  <div className="card-body">
                    <div className="fw-bold text-muted mb-1">Total Cabs</div>
                    <div className="display-6" style={{ color: "#b8860b" }}>{totalCabs}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card shadow-sm" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <Bar data={barChartData} options={barChartOptions} plugins={[ChartDataLabels]} />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card shadow-sm" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <Doughnut data={doughnutChartData} options={doughnutChartOptions} plugins={[ChartDataLabels]} />
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Messages */}
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Latest Messages</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      {latestMessages.map((msg) => (
                        <li key={msg.id} className="list-group-item">
                          <strong>{msg.user}:</strong> {msg.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="card shadow-sm">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Recent Bookings</h5>
                  </div>
                  <div className="card-body">
                    {bookingsLoading ? (
                      <Skeleton height={120} borderRadius={8} />
                    ) : (
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Pickup Location</th>
                            <th>Drop Location</th>
                            <th>Pickup Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center text-muted">
                                No bookings found.
                              </td>
                            </tr>
                          ) : (
                            recentBookings.map((booking) => (
                              <tr key={booking.bookingId}>
                                <td>{booking.bookingId}</td>
                                <td>
                                  <span
                                    title={booking.pickupLocation}
                                    style={{
                                      display: "inline-block",
                                      maxWidth: 120,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    {booking.pickupLocation}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    title={booking.dropLocation}
                                    style={{
                                      display: "inline-block",
                                      maxWidth: 120,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    {booking.dropLocation}
                                  </span>
                                </td>
                                <td>
                                  {booking.pickupDateTime
                                    ? new Date(booking.pickupDateTime).toLocaleString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                    : "-"}
                                </td>
                                <td>
                                  <span
                                    className={`badge fw-semibold ${booking.bookingStatus === "Completed"
                                      ? "bg-success"
                                      : booking.bookingStatus === "Pending"
                                        ? "bg-warning text-dark"
                                        : "bg-danger"
                                      }`}
                                    style={{ fontSize: 13 }}
                                  >
                                    {booking.bookingStatus}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;