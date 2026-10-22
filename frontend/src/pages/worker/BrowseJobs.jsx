import { apiUrl } from "../../config/api";
import React, { useState, useEffect, useContext } from "react";
import { Search, MapPin, Briefcase, Filter, Users, Clock, Wrench, Home, Shield, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Helper to format relative time
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 30) return `${diffInDays} days ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `over ${Math.floor(diffInDays / 365)} year ago`;
};

// Helper for category icon
const getCategoryIcon = (category) => {
  if (category?.toLowerCase().includes("plumb")) return <Wrench className="w-4 h-4" />;
  if (category?.toLowerCase().includes("house")) return <Home className="w-4 h-4" />;
  if (category?.toLowerCase().includes("secur")) return <Shield className="w-4 h-4" />;
  return <Briefcase className="w-4 h-4" />;
};

const BrowseJobs = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(apiUrl("/api/jobs"));
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!user) {
      toast.error("Please login to apply for jobs");
      navigate("/login");
      return;
    }

    if (user.role !== "worker") {
      toast.error("Only workers can apply for jobs");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const res = await axios.post(
        apiUrl(`/api/jobs/${jobId}/apply`),
        {},
        config,
      );
      if (res.data.success) {
        toast.success("Successfully applied for the job!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply for job");
    }
  };

  // Filter jobs based on search
  const filteredJobs = jobs.filter((job) => {
    if (search && !job.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (
      location &&
      !job.location.toLowerCase().includes(location.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-900 pb-12 pt-8">
      {/* Search Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto px-4 mb-8"
      >
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 relative z-10">
            Find Your Next Job
          </h1>

          <div className="flex flex-col md:flex-row gap-4 relative z-10 w-full max-w-4xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] shadow-sm"
              />
            </div>
            <div className="relative flex-1 md:max-w-xs">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="City or zip"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] shadow-sm"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-10 text-slate-500 font-bold">
            Loading jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-bold">
            No jobs found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-full">
                      {getCategoryIcon(job.category)}
                    </div>
                    <span className="px-3 py-1 bg-[#F16622] text-white text-xs font-semibold rounded-full">
                      {job.category || "General"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0D6EFD] dark:text-[#3B82F6] mb-1 line-clamp-2 min-h-[56px]">
                    {job.title}
                  </h3>
                  
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 truncate">
                    {job.employerId?.companyName || job.employerId?.name || "Company"}
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 min-h-[60px]">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6 min-h-[28px]">
                    {job.requiredSkills?.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" /> 
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 shrink-0" /> 
                      <span className="truncate text-slate-700 dark:text-slate-300">₹{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{timeAgo(job.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 shrink-0" />
                      <span>{job.applicantCount || 0} applicants</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                  <button 
                    onClick={() => navigate(`/worker/jobs/${job._id}`)}
                    className="flex-1 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApply(job._id)}
                    className="flex-1 py-2.5 bg-[#0D6EFD] hover:bg-[#0b5ed7] text-white font-bold rounded-lg transition-colors text-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
