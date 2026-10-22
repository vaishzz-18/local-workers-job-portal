import { apiUrl } from "../../config/api";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Briefcase,
  Eye,
  Users,
  CheckCircle,
  Plus,
  Building2,
  MapPin,
  X,
  Loader2,
  Send
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const EditJobModal = ({ isOpen, onClose, job, onUpdate }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: job?.title || "",
      category: job?.category || "",
      location: job?.location || "",
      salary: job?.salary || "",
      requiredSkills: job?.requiredSkills ? job.requiredSkills.join(", ") : "",
      description: job?.description || "",
    }
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        category: job.category,
        location: job.location,
        salary: job.salary,
        requiredSkills: job.requiredSkills ? job.requiredSkills.join(", ") : "",
        description: job.description,
      });
    }
  }, [job, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        requiredSkills: data.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
        salary: Number(data.salary) || 0,
      };
      
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
      const res = await axios.put(apiUrl(`/api/jobs/${job._id}`), payload, config);
      if (res.data.success) {
        toast.success("Job updated successfully!");
        onUpdate(res.data.data);
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-700"
      >
        <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center z-10">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Edit Job Posting</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Job Title *</label>
              <input
                {...register("title", { required: "Job title is required" })}
                type="text"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
              />
              {errors.title && <span className="text-sm text-rose-500 mt-1">{errors.title.message}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Category *</label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                >
                  <option value="">Select a category</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Driving">Driving</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <span className="text-sm text-rose-500 mt-1">{errors.category.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Location *</label>
                <input
                  {...register("location", { required: "Location is required" })}
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                />
                {errors.location && <span className="text-sm text-rose-500 mt-1">{errors.location.message}</span>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Salary (optional)</label>
              <input
                {...register("salary")}
                type="number"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Required Skills (comma separated)</label>
              <input
                {...register("requiredSkills")}
                type="text"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Job Description *</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={5}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
              />
              {errors.description && <span className="text-sm text-rose-500 mt-1">{errors.description.message}</span>}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-70"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("jobs");
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const res = await axios.get(
        apiUrl("/api/employer/jobs"),
        config,
      );
      if (res.data.success) {
        setMyJobs(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseJob = async (jobId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
      const res = await axios.put(apiUrl(`/api/jobs/${jobId}`), { status: "Closed" }, config);
      if (res.data.success) {
        toast.success("Job closed successfully");
        setMyJobs(myJobs.map(job => job._id === jobId ? { ...job, status: "Closed" } : job));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close job");
    }
  };

  const handleJobUpdate = (updatedJob) => {
    setMyJobs(myJobs.map(job => job._id === updatedJob._id ? updatedJob : job));
  };

  const employerInfo = {
    company: user?.name || "Company Name",
  };

  const activeJobsCount = myJobs.filter((job) => job.status === "Open").length;
  const totalApplications = myJobs.reduce((sum, job) => sum + (job.applicantCount || 0), 0);
  const totalHired = myJobs.reduce((sum, job) => sum + (job.hiredCount || 0), 0);

  const stats = [
    {
      label: "Jobs Posted",
      value: myJobs.length,
      icon: (
        <Briefcase className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
      ),
    },
    {
      label: "Active Jobs",
      value: activeJobsCount,
      icon: <Eye className="w-6 h-6 text-green-500" />,
    },
    {
      label: "Applications",
      value: totalApplications,
      icon: <Users className="w-6 h-6 text-orange-500" />,
    },
    {
      label: "Hired",
      value: totalHired,
      icon: <CheckCircle className="w-6 h-6 text-pink-500" />,
    },
  ];

  return (
    <div className="w-full min-h-screen pt-8 px-4 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            Employer Dashboard
          </h1>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-800/50 w-max px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
            <Building2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>{employerInfo.company}</span>
          </div>
        </div>
        <Link to="/employer/post-job">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 gradient-bg text-white font-bold rounded-2xl shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Post New Job
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
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

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex bg-white dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-2xl w-max mb-8 shadow-sm border border-slate-100 dark:border-slate-700"
      >
        {["jobs", "applications", "workers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all capitalize ${activeTab === tab ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"}`}
          >
            {tab === "jobs"
              ? "My Jobs"
              : tab === "applications"
                ? "Applications"
                : "Find Workers"}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400 font-bold">
                Loading jobs...
              </div>
            ) : myJobs.length === 0 ? (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400 font-bold">
                You haven't posted any jobs yet.
              </div>
            ) : (
              myJobs.map((job, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={job._id}
                  className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {job.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full border ${job.status === "Open" ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}
                      >
                        {job.status || "Open"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-400" />{" "}
                        {job.location}
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        ₹{job.salary}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 mt-4 sm:mt-0">
                    <Link to={`/employer/jobs/${job._id}/applicants`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg whitespace-nowrap"
                      >
                        View Applicants
                      </motion.button>
                    </Link>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingJob(job);
                          setIsEditModalOpen(true);
                        }}
                        className="flex-1 px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCloseJob(job._id)}
                        disabled={job.status === "Closed"}
                        className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap ${job.status === "Closed" ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-70 cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30'}`}
                      >
                        {job.status === "Closed" ? "Closed" : "Close"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === "applications" && (
          <div className="glass-card rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
            To view applications, please click the "View Applicants" button on a
            specific job posting in the 'My Jobs' tab.
          </div>
        )}

        {activeTab === "workers" && (
          <div className="glass-card rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
            <Link
              to={`/employer/workers${user?.location ? `?location=${encodeURIComponent(user.location)}` : ''}`}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
            >
              Go to Find Workers page
            </Link>
          </div>
        )}
      </motion.div>
      
      <AnimatePresence>
        {isEditModalOpen && (
          <EditJobModal 
            isOpen={isEditModalOpen} 
            job={editingJob} 
            onClose={() => setIsEditModalOpen(false)} 
            onUpdate={handleJobUpdate} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployerDashboard;
