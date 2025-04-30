import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import EditUserModal from "../pages/EditUserModal";
import DeleteUserModal from "../pages/DeleteUserModal"; // Import the DeleteUserModal
import LoadingSpinner from "../spinner/LoadingSpinner"; // Import the loading spinner component

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Number of users per page;
  const [selectedUser, setSelectedUser] = useState(null); // User to edit or delete
  const [showEditModal, setShowEditModal] = useState(false); // Edit modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete modal visibility

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://userservice-a0nr.onrender.com/api/users/all");
        const data = await response.json();

        if (data.responseCode === 200 && data.responseMessage === "success") {
          setUsers(data.responseData); // Extract users from responseData
          setFilteredUsers(data.responseData); // Initialize filtered users
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
    setCurrentPage(1); // Reset to the first page after search
  };

  const handleEdit = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowEditModal(true); // Show the edit modal
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://userservice-a0nr.onrender.com/api/users/${id}`, {
        method: "DELETE",
      });

      const data = await response.json(); // Parse the JSON response

      if (data.responseCode === 200 && data.responseMessage === "success") {
        const updatedUsers = users.filter((user) => user.id !== id); // Remove the deleted user from the list
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        return true; // Indicate success
      } else {
        console.error(`Failed to delete user: ${data.responseMessage}`);
        return false; // Indicate failure
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return false; // Indicate failure
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`https://userservice-a0nr.onrender.com/api/users/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedUser), // Send the updated user details
      });

      const data = await response.json(); // Parse the JSON response

      if (data.responseCode === 200 && data.responseMessage === "success") {
        const updatedUser = data.responseData[0]; // Extract the updated user from the response
        const updatedUsers = users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        setUsers(updatedUsers); // Update the users list
        setFilteredUsers(updatedUsers); // Update the filtered users list
        return true; // Indicate success
      } else {
        console.error(`Failed to update user: ${data.responseMessage}`);
        return false; // Indicate failure
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return false; // Indicate failure
    }
  };

  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  };

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <Layout>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-primary">Users List</h1>
          <input
            type="text"
            className="form-control w-25 border-dark"
            placeholder="Search by name, email, or phone"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Loading Spinner Below the Search Box */}
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
                          setSelectedUser(user); // Set the selected user for deletion
                          setShowDeleteModal(true); // Show the delete modal
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

        <div className="d-flex justify-content-between align-items-center mt-3">
          <p>
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
                className={`btn btn-sm ${currentPage === index + 1 ? "btn-secondary" : "btn-outline-primary"} me-1`}
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
        handleUpdateUser={handleUpdateUser}
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