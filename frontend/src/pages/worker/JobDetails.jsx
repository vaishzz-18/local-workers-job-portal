import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Building,
  Loader2,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  useEffect(() => {
    const fetchJobAndApplicationStatus = async () => {
      try {
        const jobRes = await axios.get(apiUrl(`/api/jobs/${id}`));
        setJob(jobRes.data.data);
        /* Check if already applied */ const appsRes = await axios.get(
          apiUrl("/api/worker/applications"),
        );
        const apps = appsRes.data.data || [];
        const applied = apps.some((app) => app.jobId && app.jobId._id === id);
        setHasApplied(applied);
      } catch (error) {
        console.error("Failed to fetch details", error);
        toast.error("Job not found");
        navigate("/worker/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndApplicationStatus();
  }, [id, navigate]);
  const handleApply = async () => {
    setApplying(true);
    try {
      await axios.post(apiUrl(`/api/jobs/${id}/apply`));
      toast.success("Successfully applied for this job!");
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
      </div>
    );
  }
  if (!job) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {" "}
      <Link
        to="/worker/jobs"
        className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 font-medium transition-colors mb-4"
      >
        {" "}
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs{" "}
      </Link>{" "}
      <div className="glass p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
        {" "}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-700 pb-8">
          {" "}
          <div>
            {" "}
            <div className="flex items-center gap-3 mb-3">
              {" "}
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {job.title}
              </h1>{" "}
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold rounded-full">
                {" "}
                {job.category || "General"}{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex flex-wrap items-center gap-6 mt-4">
              {" "}
              <div className="flex items-center text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl">
                {" "}
                <Building className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />{" "}
                <span className="font-medium">
                  {job.employerId?.companyName || "Company Name"}
                </span>{" "}
              </div>{" "}
              <div className="flex items-center text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl">
                {" "}
                <MapPin className="w-5 h-5 mr-2 text-rose-500" />{" "}
                <span className="font-medium">{job.location}</span>{" "}
              </div>{" "}
              <div className="flex items-center text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl">
                {" "}
                <DollarSign className="w-5 h-5 mr-2 text-emerald-500" />{" "}
                <span className="font-medium">
                  {job.salary ? `$${job.salary}` : "Competitive Salary"}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="shrink-0 w-full md:w-auto">
            {" "}
            {hasApplied ? (
              <div className="w-full md:w-auto px-8 py-3.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl flex items-center justify-center gap-2 border border-emerald-200">
                {" "}
                <CheckCircle className="w-5 h-5" /> Applied{" "}
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full md:w-auto px-10 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 flex items-center justify-center"
              >
                {" "}
                {applying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Apply Now"
                )}{" "}
              </button>
            )}{" "}
          </div>{" "}
        </div>{" "}
        <div className="space-y-8">
          {" "}
          <div>
            {" "}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Job Description
            </h2>{" "}
            <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {" "}
              {job.description}{" "}
            </div>{" "}
          </div>{" "}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div>
              {" "}
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Required Skills
              </h2>{" "}
              <div className="flex flex-wrap gap-2">
                {" "}
                {job.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium"
                  >
                    {" "}
                    {skill}{" "}
                  </span>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </motion.div>
  );
};
export default JobDetails;
