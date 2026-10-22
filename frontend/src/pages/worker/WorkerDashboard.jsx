import { apiUrl } from "../../config/api";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  MapPin,
  Phone,
  Mail,
  Edit,
  Star,
  CheckCircle,
  Zap,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import WorkerProfile from "./WorkerProfile";

const WorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("matched");
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const [profileRes, appsRes] = await Promise.all([
        axios
          .get(apiUrl("/api/worker/profile"), config)
          .catch(() => ({ data: { data: null } })), // Profile might not exist yet
        axios.get(apiUrl("/api/applications"), config),
      ]);

      setProfile(profileRes.data.data);
      if (appsRes.data.success) {
        setApplications(appsRes.data.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const name = user?.name || "Worker";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const location = profile?.city || profile?.userId?.location || user?.location || "Location Not Set";
  const phone = profile?.userId?.phone || user?.phone || "Phone Not Set";
  const status = profile?.availability || "Available";
  const experience = profile?.experience || 0;

  if (loading) {
    return (
      <div className="w-full min-h-screen pt-8 px-4 flex justify-center items-center font-bold text-slate-500 dark:text-slate-400">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-8 px-4 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Worker Dashboard
        </h1>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Profile Card */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-1/3 lg:w-1/4 shrink-0"
        >
          <div className="glass-card rounded-3xl p-8 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-4xl font-extrabold shadow-xl border-4 border-white mb-6 relative z-10">
              {initials}
            </div>

            <div className="flex items-center gap-2 mb-2 relative z-10 text-center">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {name}
              </h2>
              {profile && (
                <CheckCircle className="w-6 h-6 text-indigo-500 dark:text-indigo-400 fill-indigo-100" />
              )}
            </div>

            <div
              className={`w-full text-sm font-bold px-4 py-2 rounded-xl text-center mb-8 relative z-10 shadow-sm border ${status === "Available" ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" : "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"}`}
            >
              {status}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-8 relative z-10">
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {applications.length}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Applied
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-center text-2xl font-extrabold text-orange-500 gap-1">
                  {experience}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Yrs Exp
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-center text-2xl font-extrabold text-amber-500 gap-1">
                  {profile?.rating ? profile.rating.toFixed(1) : "New"}
                  {profile?.rating > 0 && <Star className="w-4 h-4 fill-amber-500" />}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Rating
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="text-2xl font-extrabold text-green-600 dark:text-green-400">
                  {profile?.jobsCompleted || 0}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Jobs Done
                </div>
              </div>
            </div>

            <div className="w-full space-y-4 mb-8 text-sm font-medium text-slate-600 dark:text-slate-300 relative z-10">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />{" "}
                <span className="truncate">{location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400 shrink-0" />{" "}
                <span className="truncate">{phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400 shrink-0" />{" "}
                <span className="truncate">{user?.email}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("edit")}
              className="w-full py-3 flex items-center justify-center gap-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg relative z-10"
            >
              <Edit className="w-5 h-5" /> Edit Profile
            </motion.button>
          </div>
        </motion.div>

        {/* Right Content Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-2/3 lg:w-3/4"
        >
          {/* Tabs */}
          <div className="flex flex-wrap bg-white dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-2xl mb-8 shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
            {["matched", "applications", "edit"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all capitalize whitespace-nowrap ${activeTab === tab ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"}`}
              >
                {tab === "matched"
                  ? "Find Jobs"
                  : tab === "applications"
                    ? "My Applications"
                    : "Edit Profile"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "matched" && (
              <div className="glass-card rounded-3xl p-12 text-center">
                <Zap className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Ready to work?
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                  Head over to the jobs page to find your next opportunity.
                </p>
                <a
                  href="/worker/jobs"
                  className="inline-block px-8 py-3 gradient-bg text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Jobs
                </a>
              </div>
            )}

            {activeTab === "applications" && (
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                  Your job applications ({applications.length})
                </p>
                {applications.length === 0 ? (
                  <div className="glass-card rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                    No applications found yet. Keep applying!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        key={app._id}
                        className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
                            {app.jobId?.title || "Job Deleted"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-800">
                              {app.jobId?.category || "Unknown Category"}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-indigo-400" />{" "}
                              {app.jobId?.location || "Unknown Location"}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                            app.status === 'Approved' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' :
                            app.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' :
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                          }`}>
                            {app.status}
                          </span>
                          <div>
                            Applied: {new Date(app.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "edit" && (
              <div className="-mt-8">
                <WorkerProfile />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
