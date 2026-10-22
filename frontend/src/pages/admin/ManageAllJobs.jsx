import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Briefcase, Loader2, Trash2, MapPin, Search } from "lucide-react";
import { toast } from "react-hot-toast";
const ManageAllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchJobs();
  }, []);
  const fetchJobs = async () => {
    try {
      const res = await axios.get(apiUrl("/api/jobs"));
      setJobs(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Delete this job? This action cannot be undone.")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        await axios.delete(apiUrl(`/api/admin/jobs/${id}`), config);
        setJobs(jobs.filter((j) => j._id !== id));
        toast.success("Job deleted successfully");
      } catch (error) {
        toast.error("Failed to delete job");
      }
    }
  };
  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.employerId?.companyName &&
        j.employerId.companyName.toLowerCase().includes(search.toLowerCase())),
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
            Manage All Jobs
          </h1>{" "}
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Moderate global job listings across the platform.
          </p>{" "}
        </div>{" "}
        <div className="relative w-full md:w-72">
          {" "}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />{" "}
          <input
            type="text"
            placeholder="Search jobs or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          />{" "}
        </div>{" "}
      </div>{" "}
      <div className="space-y-4">
        {" "}
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-800 hover:shadow-md transition-all"
            >
              {" "}
              <div className="flex-grow w-full">
                {" "}
                <div className="flex items-start justify-between mb-2">
                  {" "}
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h2>{" "}
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    {" "}
                    {job.category}{" "}
                  </span>{" "}
                </div>{" "}
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                  {" "}
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {job.employerId?.companyName || "Unknown Employer"}
                  </span>{" "}
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />{" "}
                    {job.location}
                  </span>{" "}
                  <span>{job.status}</span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
                {" "}
                <button
                  onClick={() => handleDelete(job._id)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 font-medium rounded-xl transition-colors"
                >
                  {" "}
                  <Trash2 className="w-4 h-4" /> Remove{" "}
                </button>{" "}
              </div>{" "}
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center glass rounded-2xl border border-slate-100 dark:border-slate-700">
            {" "}
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />{" "}
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No jobs found
            </h3>{" "}
            <p className="text-slate-500 dark:text-slate-400">
              No jobs match your search criteria.
            </p>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </motion.div>
  );
};
export default ManageAllJobs;
