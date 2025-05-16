import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import AddUserModal from "../modal/AddUserModal";
import DeleteUserModal from "../pages/DeleteUserModal";
import LoadingSpinner from "../spinner/LoadingSpinner";
import API_ENDPOINTS from "../config/apiConfig";
import UserBookingsModal from "../modal/UserBookingsModal";
import ViewUserModal from "../modal/ViewUserModal";

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.GET_ALL_USERS);
        const data = await response.json();

        if (data.responseCode === 200 && data.responseMessage === "success") {
          setUsers(data.responseData);
          setFilteredUsers(data.responseData);
        } else {
          console.error("Error fetching users: Invalid response structure");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_USER(id), {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.responseCode === 200 && data.responseMessage === "success") {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        return true;
      } else {
        console.error(`Failed to delete user: ${data.responseMessage}`);
        return false;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  };

  const handleAddUser = (newUser) => {
    const userWithCreatedAt = {
      ...newUser,
      createdAt: newUser.createdAt || new Date().toISOString(),
    };

    setUsers((prevUsers) => [userWithCreatedAt, ...prevUsers]);
    setFilteredUsers((prevUsers) => [userWithCreatedAt, ...prevUsers]);
    setCurrentPage(1);
    setShowAddUserModal(false);
  };

  // Sorting handler
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort users before pagination
  const getSortedUsers = () => {
    const sorted = [...filteredUsers].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // For date, convert to timestamp
      if (sortConfig.key === "createdAt") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  // Update getPaginatedUsers to use sorted users
  const getPaginatedUsers = () => {
    const sorted = getSortedUsers();
    const startIndex = (currentPage - 1) * pageSize;
    return sorted.slice(startIndex, startIndex + pageSize);
  };

  const handleShowBookings = async (user) => {
    setSelectedUser(user);
    setShowBookingsModal(true);
    setBookingsLoading(true);
    setBookingsError(null);
    setUserBookings([]);
    try {
      const response = await fetch(API_ENDPOINTS.GET_BOOKINGS_BY_USER_ID(user.id));
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      if (data.responseCode === 200 && Array.isArray(data.responseData)) {
        setUserBookings(data.responseData.flat());
      } else {
        setUserBookings([]);
      }
    } catch (err) {
      setBookingsError("Could not load bookings.");
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Role", "Verified", "Created At"];
    const rows = getSortedUsers().map(user => [
      user.id,
      `"${user.name}"`,
      `"${user.email}"`,
      `"${user.phone}"`,
      user.role,
      user.verified ? "Yes" : "No",
      user.createdAt ? new Date(user.createdAt).toLocaleString("en-IN") : ""
    ]);
    const csvContent =
      [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <Layout>
      <div className="container-fluid mt-4">
        <div className="row mb-4 align-items-center">
          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <h1
              className="fw-bold"
              style={{
                color: "#ffc107",
                letterSpacing: 1,
              }}
            >
              <i className="bi bi-people-fill me-2" style={{ color: "#ffc107" }}></i>
              Users List
            </h1>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-end align-items-center gap-2">

            <button
              className="btn btn-warning btn-sm fw-bold d-flex align-items-center shadow-sm"
              style={{
                borderColor: "#ffc107",
                background: "#ffc107",
                color: "#7c5c00",
                borderRadius: 6,
                padding: "0.25rem 0.75rem",
                fontSize: "0.97rem",
                minWidth: 90,
                justifyContent: "center",
                boxShadow: "0 1px 4px #ffe06655"
              }}
              onClick={() => setShowAddUserModal(true)}
            >
              <i className="bi bi-person-plus me-1" style={{ fontSize: "1.1rem" }}></i>
              Add User
            </button>
            <button
              className="btn btn-warning btn-sm fw-bold d-flex align-items-center shadow-sm"
              style={{
                borderColor: "#ffc107",
                background: "#ffc107",
                color: "#7c5c00",
                borderRadius: 6,
                padding: "0.25rem 0.75rem",
                fontSize: "0.97rem",
                minWidth: 90,
                justifyContent: "center",
                boxShadow: "0 1px 4px #ffe06655"
              }}
              onClick={handleExportCSV}
              title="Export as CSV"
            >
              <i className="bi bi-file-earmark-spreadsheet me-1" style={{ fontSize: "1.1rem" }}></i>
              Export CSV
            </button>
            <div className="input-group w-50">
              <input
                type="text"
                className="form-control border-warning"
                placeholder="Search by name, email, or phone"
                value={searchQuery}
                onChange={handleSearch}
              />
              <span className="input-group-text border-warning bg-warning text-dark">
                <i className="bi bi-search"></i>
              </span>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {!loading && (
          <div
            className="table-responsive"
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 16px #00000010",
              overflow: "hidden",
              background: "#fff"
            }}
          >
            <table className="table table-hover table-striped table-bordered align-middle mb-0" style={{ minWidth: 900 }}>
              <thead className="table-warning" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  <th style={{ width: 60, cursor: "pointer" }} onClick={() => handleSort("id")}>
                    ID{" "}
                    {sortConfig.key === "id" && (
                      <i className={`bi bi-caret-${sortConfig.direction === "asc" ? "up" : "down"}-fill`}></i>
                    )}
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("createdAt")}>
                    Created At{" "}
                    {sortConfig.key === "createdAt" && (
                      <i className={`bi bi-caret-${sortConfig.direction === "asc" ? "up" : "down"}-fill`}></i>
                    )}
                  </th>
                  <th style={{ minWidth: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedUsers().map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <span
                        className="fw-semibold d-inline-block text-truncate"
                        style={{ color: "#b8860b", maxWidth: 120, verticalAlign: "middle" }}
                        title={user.name}
                      >
                        {user.name}
                      </span>
                    </td>
                    <td>
                      <span
                        className="d-inline-block text-truncate"
                        style={{ maxWidth: 140, verticalAlign: "middle" }}
                        title={user.email}
                      >
                        {user.email}
                      </span>
                    </td>
                    <td>
                      <span
                        className="d-inline-block text-truncate"
                        style={{ maxWidth: 100, verticalAlign: "middle" }}
                        title={user.phone}
                      >
                        {user.phone}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge bg-secondary text-light px-2 py-1"
                        style={{ fontWeight: 500 }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.verified ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-secondary">No</span>
                      )}
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td>
                      <div className="d-flex flex-column flex-md-row gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowViewModal(true);
                          }}
                          title="View User"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleShowBookings(user)}
                          title="Show Bookings"
                        >
                          <i className="bi bi-calendar-check me-1"></i> Bookings
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          title="Delete User"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
          <p className="mb-2 mb-md-0">
            Showing {getPaginatedUsers().length} of {filteredUsers.length} users
          </p>
          <div>
            <button
              className="btn btn-warning btn-sm me-2"
              style={{ borderColor: "#ffc107" }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm ${currentPage === index + 1 ? "btn-warning text-dark fw-bold" : "btn-outline-warning"}`}
                style={{ borderColor: "#ffc107", marginRight: 2 }}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn btn-warning btn-sm"
              style={{ borderColor: "#ffc107" }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(false)}
        handleAddUser={handleAddUser}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        handleDelete={handleDelete}
        selectedUser={selectedUser}
      />

      <UserBookingsModal
        show={showBookingsModal}
        onHide={() => setShowBookingsModal(false)}
        bookings={userBookings}
        loading={bookingsLoading}
        error={bookingsError}
        user={selectedUser}
      />

      <ViewUserModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        user={selectedUser}
      />
    </Layout>
  );
};

export default ShowUsers;