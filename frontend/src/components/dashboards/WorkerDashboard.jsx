import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const WorkerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const profileRes = await axios.get(
        apiUrl("/api/worker/profile"),
      );
      setProfile(profileRes.data.data);

      const jobsRes = await axios.get(apiUrl("/api/jobs"));
      setJobs(jobsRes.data.data);

      const appsRes = await axios.get(apiUrl("/api/applications"));
      setApplications(appsRes.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(apiUrl(`/api/jobs/${jobId}/apply`));
      toast.success("Applied successfully!");
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  if (loading) return <div className="text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Profile Summary */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Profile</h2>
        <div className="text-gray-700">
          <p>
            <span className="font-semibold">Skills:</span>{" "}
            {profile?.skills?.join(", ") || "None listed"}
          </p>
          <p>
            <span className="font-semibold">Experience:</span>{" "}
            {profile?.experience} years
          </p>
          <p>
            <span className="font-semibold">Availability:</span>{" "}
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {profile?.availability}
            </span>
          </p>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Available Jobs */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Available Jobs
          </h2>
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <p className="text-gray-500">No open jobs found.</p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {job.category} • {job.location}
                    </p>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">
                      ${job.salary}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApply(job._id)}
                    className="mt-4 w-full py-2 bg-blue-50 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:bg-blue-900/50 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* My Applications */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            My Applications
          </h2>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <p className="text-gray-500">
                You haven't applied to any jobs yet.
              </p>
            ) : (
              applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {app.jobId?.title || "Unknown Job"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Applied on:{" "}
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorkerDashboard;
