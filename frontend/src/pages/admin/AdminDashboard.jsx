import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  Building,
  BarChart2,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  Shield,
  X,
  UserCircle
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import ManageAllJobs from "./ManageAllJobs";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("workers");
  const [dashboardStats, setDashboardStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    pendingVerifications: 0
  });
  const [allUsers, setAllUsers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const [statsRes, usersRes, verifsRes] = await Promise.all([
        axios.get(apiUrl("/api/admin/dashboard"), config),
        axios.get(apiUrl("/api/admin/users"), config),
        axios.get(apiUrl("/api/admin/verifications"), config)
      ]);

      if (statsRes.data.success) setDashboardStats(statsRes.data.data);
      if (usersRes.data.success) setAllUsers(usersRes.data.data);
      if (verifsRes.data.success) setVerifications(verifsRes.data.data);
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const res = await axios.delete(
        apiUrl(`/api/admin/users/${userId}`),
        config,
      );
      if (res.data.success) {
        toast.success("User deleted successfully");
        setAllUsers(allUsers.filter((u) => u._id !== userId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleUpdateVerification = async (profileId, status) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
      const res = await axios.put(
        apiUrl(`/api/admin/verifications/${profileId}`),
        { status },
        config
      );
      if (res.data.success) {
        toast.success(`Worker ${status} successfully`);
        setVerifications(verifications.filter(v => v._id !== profileId));
        setDashboardStats({...dashboardStats, pendingVerifications: dashboardStats.pendingVerifications - 1});
      }
    } catch (error) {
      toast.error("Failed to update verification status");
    }
  };

  const handleViewProfile = async (userId) => {
    try {
      setLoadingProfile(true);
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
      const res = await axios.get(apiUrl(`/api/admin/users/${userId}/profile`), config);
      if (res.data.success) {
        setSelectedProfile(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load profile details");
    } finally {
      setLoadingProfile(false);
    }
  };

  const workers = allUsers.filter((u) => u.role === "worker");
  const employers = allUsers.filter((u) => u.role === "employer");

  const stats = [
    {
      label: "Total Users",
      value: dashboardStats.users,
      icon: <Users className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />,
    },
    {
      label: "Workers",
      value: workers.length,
      icon: <Briefcase className="w-6 h-6 text-pink-500" />,
    },
    {
      label: "Employers",
      value: employers.length,
      icon: <Building className="w-6 h-6 text-orange-500" />,
    },
    {
      label: "Total Jobs",
      value: dashboardStats.jobs,
      icon: <BarChart2 className="w-6 h-6 text-green-500" />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-8 px-4 flex justify-center items-center text-slate-500 dark:text-slate-400 font-bold">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-8 px-4 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-4"
      >
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-pink-500 p-3 rounded-2xl text-white shadow-xl flex items-center justify-center">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage users, jobs, and platform settings
          </p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 mt-8">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="glass-card glass-card-hover p-6 rounded-3xl flex items-center gap-5"
          >
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Tabs */}
      <div className="mb-8 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex bg-white dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-2xl w-max shadow-sm border border-slate-100 dark:border-slate-700"
        >
          {["workers", "employers", "jobs", "verifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all capitalize ${activeTab === tab ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"}`}
            >
              {tab === "workers"
                ? `Workers (${workers.length})`
                : tab === "employers"
                  ? `Employers (${employers.length})`
                  : tab === "jobs"
                    ? `Jobs (${dashboardStats.jobs})`
                    : `Verifications (${dashboardStats.pendingVerifications || 0})`}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card rounded-3xl overflow-hidden shadow-xl"
      >
        {activeTab === "workers" && (
          <div className="p-8 overflow-x-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
              Registered Workers
            </h2>
            {workers.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No workers registered yet.
              </p>
            ) : (
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      Name
                    </th>
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      Email
                    </th>
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      Location
                    </th>
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workers.map((worker) => (
                    <motion.tr
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                      key={worker._id}
                      className="transition-colors"
                    >
                      <td className="py-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold shadow-inner border border-white">
                          {worker.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {worker.name}
                        </span>
                      </td>
                      <td className="py-5 font-medium">{worker.email}</td>
                      <td className="py-5 font-medium">
                        {worker.location || "N/A"}
                      </td>
                      <td className="py-5">
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleViewProfile(worker._id)}
                            className="text-slate-400 hover:text-indigo-600 dark:text-indigo-400 transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(worker._id)}
                            className="text-slate-400 hover:text-red-600 dark:text-red-400 transition-colors"
                            title="Delete Worker"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "employers" && (
          <div className="p-8 overflow-x-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
              Registered Employers
            </h2>
            {employers.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No employers registered yet.
              </p>
            ) : (
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      Name
                    </th>
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      Email
                    </th>
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      Location
                    </th>
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employers.map((employer) => (
                    <motion.tr
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                      key={employer._id}
                      className="transition-colors"
                    >
                      <td className="py-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 text-orange-600 dark:text-orange-400 flex items-center justify-center font-extrabold shadow-inner border border-white">
                          {employer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {employer.name}
                        </span>
                      </td>
                      <td className="py-5 font-medium">{employer.email}</td>
                      <td className="py-5 font-medium">
                        {employer.location || "N/A"}
                      </td>
                      <td className="py-5">
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleViewProfile(employer._id)}
                            className="text-slate-400 hover:text-indigo-600 dark:text-indigo-400 transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(employer._id)}
                            className="text-slate-400 hover:text-red-600 dark:text-red-400 transition-colors"
                            title="Delete Employer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="-mt-8">
            <ManageAllJobs />
          </div>
        )}

        {activeTab === "verifications" && (
          <div className="p-8 overflow-x-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
              Pending Verification Requests
            </h2>
            {verifications.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No pending verifications at the moment.
              </p>
            ) : (
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Worker</th>
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Documents</th>
                    <th className="pb-4 font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {verifications.map((v) => (
                    <motion.tr key={v._id} className="transition-colors">
                      <td className="py-5">
                        <div className="font-extrabold text-slate-900 dark:text-white">{v.userId?.name}</div>
                        <div className="text-xs">{v.userId?.email}</div>
                      </td>
                      <td className="py-5">
                        <div className="flex flex-col gap-1">
                          {v.documents && v.documents.map((doc, idx) => (
                            <a key={idx} href={doc.url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                              {doc.name}
                            </a>
                          ))}
                        </div>
                      </td>
                      <td className="py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleUpdateVerification(v._id, 'Approved')} className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold rounded-xl hover:bg-green-200 transition-colors text-xs">
                            Approve
                          </button>
                          <button onClick={() => handleUpdateVerification(v._id, 'Rejected')} className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 transition-colors text-xs">
                            Reject
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </motion.div>

      {/* Profile Viewer Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center z-10">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCircle className="w-6 h-6 text-indigo-500" />
                User Profile
              </h3>
              <button
                onClick={() => setSelectedProfile(null)}
                className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Basic Info */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-2xl rounded-2xl shadow-inner border border-white">
                  {selectedProfile.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">{selectedProfile.user.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{selectedProfile.user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
                      {selectedProfile.user.role}
                    </span>
                    {selectedProfile.user.phone && (
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full">
                        {selectedProfile.user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specific Profile Details */}
              {selectedProfile.profile ? (
                <div className="space-y-6">
                  {selectedProfile.user.role === 'worker' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                          <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Status</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">{selectedProfile.profile.verificationStatus}</span>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                          <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">City</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">{selectedProfile.profile.city || "Not specified"}</span>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                          <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Experience</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">{selectedProfile.profile.experience} Years</span>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                          <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Pricing</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">₹{selectedProfile.profile.pricing} / {selectedProfile.profile.pricingType}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Skills</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProfile.profile.skills && selectedProfile.profile.skills.length > 0 ? (
                            selectedProfile.profile.skills.map((s, i) => (
                              <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400 text-sm">No skills added</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Bio</span>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                          {selectedProfile.profile.bio || "No bio provided."}
                        </p>
                      </div>

                      {selectedProfile.profile.documents && selectedProfile.profile.documents.length > 0 && (
                        <div>
                          <span className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Documents</span>
                          <div className="flex flex-col gap-2">
                            {selectedProfile.profile.documents.map((doc, idx) => (
                              <a key={idx} href={doc.url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-2 p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl">
                                📄 {doc.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedProfile.user.role === 'employer' && (
                    <>
                      <div>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Company Name</span>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl font-extrabold text-slate-900 dark:text-white">
                          {selectedProfile.profile.companyName || "Individual / Not specified"}
                        </div>
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Company Description</span>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                          {selectedProfile.profile.description || "No description provided."}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">This user has not set up their extended profile yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
