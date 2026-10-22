import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Clock,
  Star,
  Camera,
} from "lucide-react";
import { toast } from "react-hot-toast";

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    feedback: "",
    photos: []
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  useEffect(() => {
    fetchApplicants();
  }, [jobId]);
  const fetchApplicants = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
      const res = await axios.get(
        apiUrl(`/api/employer/jobs/${jobId}/applicants`),
        config
      );
      setApplicants(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch applicants", error);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
      await axios.put(
        apiUrl(`/api/employer/applications/${applicationId}/status`),
        { status },
        config
      );
      toast.success(`Application marked as ${status}`);
      /* Refresh list */ fetchApplicants();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleOpenReviewModal = (app) => {
    setSelectedApp(app);
    setReviewData({ rating: 5, feedback: "", photos: [] });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewData.feedback) {
      return toast.error("Feedback is required");
    }

    try {
      setSubmittingReview(true);
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("workerId", selectedApp.workerId._id);
      formData.append("rating", reviewData.rating);
      formData.append("feedback", reviewData.feedback);
      
      Array.from(reviewData.photos).forEach((file) => {
        formData.append("photos", file);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await axios.post(apiUrl("/api/reviews"), formData, config);
      if (res.data.success) {
        toast.success("Review submitted successfully");
        setShowReviewModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
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
      className="space-y-6 max-w-5xl mx-auto"
    >
      {" "}
      <Link
        to="/employer/jobs"
        className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 font-medium transition-colors mb-4"
      >
        {" "}
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs{" "}
      </Link>{" "}
      <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        {" "}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Applicants Review
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Review workers who have applied to this position.
        </p>{" "}
      </div>{" "}
      <div className="space-y-6">
        {" "}
        {applicants.length > 0 ? (
          applicants.map((app, index) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between gap-8 bg-white dark:bg-slate-800"
            >
              {" "}
              <div className="flex-grow space-y-4">
                {" "}
                <div className="flex items-start justify-between">
                  {" "}
                  <div>
                    {" "}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {app.workerId?.name || "Unknown Worker"}
                    </h2>{" "}
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                      {" "}
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-slate-400" />{" "}
                        {app.workerId?.email}
                      </span>{" "}
                      {app.workerId?.phone && (
                        <span className="flex items-center">
                          <Phone className="w-4 h-4 mr-1 text-slate-400" />{" "}
                          {app.workerId.phone}
                        </span>
                      )}{" "}
                    </div>{" "}
                  </div>{" "}
                  {/* Status Badge */}{" "}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${app.status === "Approved" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : app.status === "Rejected" ? "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800" : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"}`}
                  >
                    {" "}
                    {app.status}{" "}
                  </div>{" "}
                </div>{" "}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  {" "}
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-2">
                    {" "}
                    <Clock className="w-4 h-4 mr-2 text-slate-400" /> Applied on{" "}
                    {new Date(app.appliedDate).toLocaleDateString()}{" "}
                  </div>{" "}
                  {/* In a real app we'd fetch the worker profile and show skills here, but simplified for now */}{" "}
                </div>{" "}
              </div>{" "}
              {/* Actions */}{" "}
              <div className="shrink-0 flex md:flex-col gap-3 justify-center">
                {" "}
                {app.status === "Pending" ? (
                  <>
                    {" "}
                    <button
                      onClick={() => handleUpdateStatus(app._id, "Approved")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      {" "}
                      <CheckCircle className="w-4 h-4" /> Approve{" "}
                    </button>{" "}
                    <button
                      onClick={() => handleUpdateStatus(app._id, "Rejected")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 font-medium rounded-xl hover:bg-rose-100 dark:bg-rose-900/50 transition-colors"
                    >
                      {" "}
                      <XCircle className="w-4 h-4" /> Reject{" "}
                    </button>{" "}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(app._id, "Pending")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Reset Status
                    </button>
                    {app.status === "Approved" && (
                      <button
                        onClick={() => handleOpenReviewModal(app)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#F16622] text-white font-medium rounded-xl hover:bg-[#d65a1e] transition-colors"
                      >
                        <Star className="w-4 h-4 fill-white" /> Leave Review
                      </button>
                    )}
                  </>
                )}{" "}
              </div>{" "}
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center glass rounded-2xl border border-slate-100 dark:border-slate-700">
            {" "}
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />{" "}
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No applicants yet
            </h3>{" "}
            <p className="text-slate-500 dark:text-slate-400">
              Wait for workers to apply to this position.
            </p>{" "}
          </div>
        )}{" "}
      </div>{" "}

      {/* Review Modal */}
      {showReviewModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Leave Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`p-2 rounded-lg transition-colors ${reviewData.rating >= star ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                    >
                      <Star className={`w-8 h-8 ${reviewData.rating >= star ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Feedback
                </label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0D6EFD]"
                  placeholder="Share your experience working with this person..."
                  value={reviewData.feedback}
                  onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Upload Photos (Proof of work)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center justify-center w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                    <Camera className="w-6 h-6 text-slate-400" />
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setReviewData({ ...reviewData, photos: e.target.files })}
                    />
                  </label>
                  <span className="text-sm text-slate-500">
                    {reviewData.photos.length > 0 ? `${reviewData.photos.length} photos selected` : "Optional"}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3.5 bg-[#0D6EFD] hover:bg-[#0b5ed7] text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {submittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Review"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  );
};
export default JobApplicants;
