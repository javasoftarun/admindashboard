import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import EditUserModal from "../pages/EditUserModal";
import DeleteUserModal from "../pages/DeleteUserModal";
import LoadingSpinner from "../spinner/LoadingSpinner";

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://userservice-a0nr.onrender.com/api/users/all");
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

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://userservice-a0nr.onrender.com/api/users/${id}`, {
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

  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  };

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <Layout>
      <div className="container-fluid mt-4">
        <div className="row mb-4">
          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <h1 className="text-primary">Users List</h1>
          </div>
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control w-100"
              placeholder="Search by name, email, or phone"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {!loading && (
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedUsers().map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>{user.verified ? "Yes" : "No"}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <i
                        className="bi bi-pencil-square text-primary me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(user)}
                        title="Edit User"
                      ></i>
                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        title="Delete User"
                      ></i>
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
              className="btn btn-primary btn-sm me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm ${
                  currentPage === index + 1 ? "btn-secondary" : "btn-outline-primary"
                } me-1`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn btn-primary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        handleDelete={handleDelete}
        selectedUser={selectedUser}
      />
    </Layout>
  );
};

export default ShowUsers;