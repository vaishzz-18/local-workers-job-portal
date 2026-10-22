import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await axios.get(
        apiUrl("/api/admin/dashboard"),
      );
      setStats(statsRes.data.data);

      const usersRes = await axios.get(apiUrl("/api/admin/users"));
      setUsers(usersRes.data.data);
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete this user? This action cannot be undone.")) {
      try {
        await axios.delete(apiUrl(`/api/admin/users/${id}`));
        toast.success("User deleted");
        fetchAdminData();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  if (loading)
    return <div className="text-gray-500">Loading admin dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">
            Total Users
          </h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {stats.users}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">
            Total Jobs
          </h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {stats.jobs}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">
            Applications
          </h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {stats.applications}
          </p>
        </div>
      </div>

      {/* Users Management */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "employer"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 font-medium text-sm transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
