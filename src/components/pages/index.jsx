import React from "react";
import Layout from "../layout/Layout";
import { Bar, Pie } from "react-chartjs-2";
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
  ArcElement
);

const Index = () => {
  // Data for the bar chart
  const barChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Bookings",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Options for the bar chart
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Bookings",
      },
    },
  };

  // Data for the pie chart
  const pieChartData = {
    labels: ["Active Cabs", "Inactive Cabs"],
    datasets: [
      {
        label: "Cab Status",
        data: [300, 50],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Example data for summary cards
  const totalUsers = 1200;
  const totalProfit = "$15,000";
  const totalBookings = 500;
  const pendingBookings = 20;

  // Example data for latest messages
  const latestMessages = [
    { id: 1, user: "John Doe", message: "Booking confirmed for tomorrow." },
    { id: 2, user: "Jane Smith", message: "Can I cancel my booking?" },
    { id: 3, user: "Mike Johnson", message: "Driver was very helpful!" },
  ];

  // Example data for recent bookings
  const recentBookings = [
    { id: 1, user: "John Doe", cab: "Toyota Prius", date: "2023-05-01", status: "Completed" },
    { id: 2, user: "Jane Smith", cab: "Honda Civic", date: "2023-05-02", status: "Pending" },
    { id: 3, user: "Mike Johnson", cab: "Ford Focus", date: "2023-05-03", status: "Cancelled" },
  ];

  return (
    <Layout>
      <div className="container mt-4">
       
        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h5 className="card-title">Total Users</h5>
                <p className="card-text display-6">{totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h5 className="card-title">Total Profit</h5>
                <p className="card-text display-6">{totalProfit}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h5 className="card-title">Total Bookings</h5>
                <p className="card-text display-6">{totalBookings}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h5 className="card-title">Pending Bookings</h5>
                <p className="card-text display-6">{pendingBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row">
          {/* Bar Chart */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <Pie data={pieChartData} />
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
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Cab</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.user}</td>
                        <td>{booking.cab}</td>
                        <td>{booking.date}</td>
                        <td>{booking.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;