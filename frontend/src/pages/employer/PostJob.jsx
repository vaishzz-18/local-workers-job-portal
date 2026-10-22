import { apiUrl } from "../../config/api";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Loader2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
const PostJob = () => {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setSaving(true);
    try {
      /* Clean up array inputs */ const payload = {
        ...data,
        requiredSkills: data.requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        salary: Number(data.salary) || 0,
      };
      await axios.post(apiUrl("/api/jobs"), payload);
      toast.success("Job posted successfully!");
      navigate("/employer/jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {" "}
      <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        {" "}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Post a New Job
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Fill out the details below to find the right candidate.
        </p>{" "}
      </div>{" "}
      <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
        {" "}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {" "}
          <div>
            {" "}
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Job Title *
            </label>{" "}
            <input
              {...register("title", { required: "Job title is required" })}
              type="text"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. Expert Plumber needed"
            />{" "}
            {errors.title && (
              <span className="text-sm text-rose-500 mt-1">
                {errors.title.message}
              </span>
            )}{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {" "}
            <div>
              {" "}
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Category *
              </label>{" "}
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {" "}
                <option value="">Select a category</option>{" "}
                <option value="Plumbing">Plumbing</option>{" "}
                <option value="Electrical">Electrical</option>{" "}
                <option value="Carpentry">Carpentry</option>{" "}
                <option value="Housekeeping">Housekeeping</option>{" "}
                <option value="Cooking">Cooking</option>{" "}
                <option value="Driving">Driving</option>{" "}
                <option value="Other">Other</option>{" "}
              </select>{" "}
              {errors.category && (
                <span className="text-sm text-rose-500 mt-1">
                  {errors.category.message}
                </span>
              )}{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Location *
              </label>{" "}
              <input
                {...register("location", { required: "Location is required" })}
                type="text"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="e.g. New York, NY"
              />{" "}
              {errors.location && (
                <span className="text-sm text-rose-500 mt-1">
                  {errors.location.message}
                </span>
              )}{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Salary (optional)
            </label>{" "}
            <input
              {...register("salary")}
              type="number"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. 500"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Required Skills (comma separated)
            </label>{" "}
            <input
              {...register("requiredSkills")}
              type="text"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. Pipe fitting, Drain cleaning"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Job Description *
            </label>{" "}
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={6}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Describe the job responsibilities and requirements..."
            />{" "}
            {errors.description && (
              <span className="text-sm text-rose-500 mt-1">
                {errors.description.message}
              </span>
            )}{" "}
          </div>{" "}
          <div className="pt-4 flex justify-end">
            {" "}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-70"
            >
              {" "}
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}{" "}
              {saving ? "Posting..." : "Post Job"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </motion.div>
  );
};
export default PostJob;
