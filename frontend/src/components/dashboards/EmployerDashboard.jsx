import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(apiUrl("/api/employer/jobs"));
      setJobs(res.data.data);
    } catch (error) {
      toast.error("Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitJob = async (data) => {
    try {
      // Convert comma-separated string to array
      data.requiredSkills = data.requiredSkills.split(",").map((s) => s.trim());
      await axios.post(apiUrl("/api/jobs"), data);
      toast.success("Job posted successfully!");
      reset();
      setShowPostJob(false);
      fetchMyJobs();
    } catch (error) {
      toast.error("Failed to post job");
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(apiUrl(`/api/jobs/${id}`));
        toast.success("Job deleted");
        fetchMyJobs();
      } catch (error) {
        toast.error("Failed to delete job");
      }
    }
  };

  if (loading) return <div className="text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">My Job Postings</h2>
        <button
          onClick={() => setShowPostJob(!showPostJob)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          {showPostJob ? "Cancel" : "Post New Job"}
        </button>
      </div>

      {showPostJob && (
        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Post a New Job
          </h3>
          <form onSubmit={handleSubmit(onSubmitJob)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="e.g. Expert Plumber Needed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="e.g. Plumbing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="e.g. Downtown"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary ($)
                </label>
                <input
                  type="number"
                  {...register("salary", { required: "Salary is required" })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="e.g. 50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="Describe the job details..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills (comma separated)
              </label>
              <input
                {...register("requiredSkills", {
                  required: "Skills are required",
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="e.g. Pipe fitting, leak repair"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Submit Job
            </button>
          </form>
        </section>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {jobs.length === 0 ? (
          <p className="text-gray-500 col-span-2">
            You haven't posted any jobs yet.
          </p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900">
                    {job.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {job.category} • {job.location}
                </p>
                <p className="font-medium text-blue-600 dark:text-blue-400 mb-4">
                  ${job.salary}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 py-2 bg-blue-50 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:bg-blue-900/50 transition-colors"
                  onClick={() => alert("View applicants functionality pending")}
                >
                  View Applicants
                </button>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:bg-red-900/50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
