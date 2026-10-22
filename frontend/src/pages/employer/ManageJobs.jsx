import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, Loader2, Users, MapPin, Edit, Trash2, Power } from "lucide-react";
import { toast } from "react-hot-toast";
const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchJobs();
  }, []);
  const fetchJobs = async () => {
    try {
      const res = await axios.get(apiUrl("/api/employer/jobs"));
      setJobs(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(apiUrl(`/api/jobs/${id}`));
        setJobs(jobs.filter((job) => job._id !== id));
        toast.success("Job deleted successfully");
      } catch (error) {
        toast.error("Failed to delete job");
      }
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const newStatus = job.status === "Open" ? "Closed" : "Open";
      const res = await axios.put(apiUrl(`/api/jobs/${job._id}`), {
        status: newStatus
      });
      setJobs(jobs.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j)));
      toast.success(`Job marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update job status");
    }
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Manage Postings
          </h1>{" "}
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and manage your active job listings.
          </p>{" "}
        </div>{" "}
        <Link
          to="/employer/post-job"
          className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          {" "}
          + Post New Job{" "}
        </Link>{" "}
      </div>{" "}
      <div className="space-y-4">
        {" "}
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-all bg-white dark:bg-slate-800"
            >
              {" "}
              <div className="flex-grow">
                {" "}
                <div className="flex items-center gap-3 mb-2">
                  {" "}
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h2>{" "}
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${job.status === "Open" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"}`}
                  >
                    {" "}
                    {job.status}{" "}
                  </span>{" "}
                </div>{" "}
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {" "}
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />{" "}
                    {job.location}
                  </span>{" "}
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1 text-slate-400" />{" "}
                    {job.category}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex items-center gap-3 shrink-0">
                {" "}
                <Link
                  to={`/employer/jobs/${job._id}/applicants`}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium rounded-xl hover:bg-indigo-100 dark:bg-indigo-900/50 transition-colors"
                >
                  {" "}
                  <Users className="w-4 h-4" /> Applicants{" "}
                </Link>{" "}
                <button
                  onClick={() => handleToggleStatus(job)}
                  className="p-2 text-slate-400 hover:text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl transition-colors"
                  title={job.status === "Open" ? "Close Job" : "Open Job"}
                >
                  <Power className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
                  title="Delete Job"
                >
                  <Trash2 className="w-5 h-5" />
                </button>{" "}
              </div>{" "}
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center glass rounded-2xl border border-slate-100 dark:border-slate-700">
            {" "}
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No jobs posted yet
            </h3>{" "}
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Create your first job posting to start receiving applicants.
            </p>{" "}
            <Link
              to="/employer/post-job"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              {" "}
              Post a Job{" "}
            </Link>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </motion.div>
  );
};
export default ManageJobs;
