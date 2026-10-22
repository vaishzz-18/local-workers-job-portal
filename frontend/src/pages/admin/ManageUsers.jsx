import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Users,
  Loader2,
  Trash2,
  Mail,
  Briefcase,
  UserCircle,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const res = await axios.get(apiUrl("/api/admin/users"));
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        await axios.delete(apiUrl(`/api/admin/users/${id}`));
        setUsers(users.filter((u) => u._id !== id));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {" "}
      <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Manage Users
          </h1>{" "}
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            View and manage all registered accounts on the platform.
          </p>{" "}
        </div>{" "}
        <div className="relative w-full md:w-72">
          {" "}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />{" "}
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          />{" "}
        </div>{" "}
      </div>{" "}
      <div className="glass rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
        {" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full text-left">
            {" "}
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
              {" "}
              <tr>
                {" "}
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
                  User
                </th>{" "}
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
                  Role
                </th>{" "}
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
                  Joined
                </th>{" "}
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">
                  Actions
                </th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-slate-100">
              {" "}
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50 dark:bg-slate-900/50 transition-colors"
                  >
                    {" "}
                    <td className="px-6 py-4">
                      {" "}
                      <div className="flex items-center gap-3">
                        {" "}
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          {" "}
                          {user.role === "Employer" ? (
                            <Briefcase className="w-5 h-5" />
                          ) : (
                            <UserCircle className="w-5 h-5" />
                          )}{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </p>{" "}
                          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                    </td>{" "}
                    <td className="px-6 py-4">
                      {" "}
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${user.role === "Admin" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" : user.role === "Employer" ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"}`}
                      >
                        {" "}
                        {user.role}{" "}
                      </span>{" "}
                    </td>{" "}
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {" "}
                      {new Date(user.createdAt).toLocaleDateString()}{" "}
                    </td>{" "}
                    <td className="px-6 py-4 text-right">
                      {" "}
                      {user.role !== "Admin" && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:bg-rose-900/30 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          {" "}
                          <Trash2 className="w-5 h-5" />{" "}
                        </button>
                      )}{" "}
                    </td>{" "}
                  </tr>
                ))
              ) : (
                <tr>
                  {" "}
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    {" "}
                    No users found matching your search.{" "}
                  </td>{" "}
                </tr>
              )}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </div>{" "}
    </motion.div>
  );
};
export default ManageUsers;
