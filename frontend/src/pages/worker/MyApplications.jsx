import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Loader2,
  Building,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get(
          apiUrl("/api/worker/applications"),
        );
        setApplications(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);
  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };
  const getStatusBg = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "Rejected":
        return "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      default:
        return "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
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
      <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        {" "}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Applications
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Track the status of all your job applications in one place.
        </p>{" "}
      </div>{" "}
      <div className="space-y-4">
        {" "}
        {applications.length > 0 ? (
          applications.map((app, index) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all bg-white dark:bg-slate-800"
            >
              {" "}
              <div className="flex-grow">
                {" "}
                <Link
                  to={`/worker/jobs/${app.jobId?._id}`}
                  className="text-xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:text-indigo-400 transition-colors block mb-2"
                >
                  {" "}
                  {app.jobId?.title || "Job Unavailable"}{" "}
                </Link>{" "}
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                  {" "}
                  <span className="flex items-center">
                    <Building className="w-4 h-4 mr-1 text-slate-400" />{" "}
                    {app.employerId?.companyName || "Employer"}
                  </span>{" "}
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-slate-400" /> Applied
                    on {new Date(app.appliedDate).toLocaleDateString()}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex items-center gap-4 shrink-0">
                {" "}
                <div
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium border ${getStatusBg(app.status)}`}
                >
                  {" "}
                  {getStatusIcon(app.status)} {app.status}{" "}
                </div>{" "}
              </div>{" "}
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center glass rounded-2xl border border-slate-100 dark:border-slate-700">
            {" "}
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No applications yet
            </h3>{" "}
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Start applying to jobs to see them here.
            </p>{" "}
            <Link
              to="/worker/jobs"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              {" "}
              Browse Jobs{" "}
            </Link>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </motion.div>
  );
};
export default MyApplications;
