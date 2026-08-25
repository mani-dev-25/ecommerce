import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { api } from "../../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async (p) => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers(p, 10);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const toggleRole = async (userId, currentRole) => {
    if (userId === currentUser?.id && currentRole === 'admin') {
      toast.error("You cannot demote yourself!");
      return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setUpdatingId(userId);
    try {
      await api.updateAdminUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      fetchUsers(page);
    } catch (error) {
      toast.error(error.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management</h2>
      </div>

      <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">No users found.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u._id}>
                    <td className="px-4 py-3 fw-medium">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => toggleRole(u._id, u.role)}
                        disabled={updatingId === u._id || (u._id === currentUser?.id)}
                      >
                        {updatingId === u._id ? 'Updating...' : u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-outline-dark me-2"
            disabled={!pagination.hasPreviousPage}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span className="align-self-center mx-3">Page {pagination.page} of {pagination.totalPages}</span>
          <button
            className="btn btn-outline-dark ms-2"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminUsers;
