import { apiUrl } from "../../config/api";
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { UserCircle, Save, Loader2, Award, Clock, MapPin, DollarSign, Upload, ShieldCheck, AlertCircle, Phone } from "lucide-react";

const WorkerProfile = () => {
  const { user, login } = useContext(AuthContext); // Need login to update local user state if profileImage changes
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("Unverified");
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [selectedDocs, setSelectedDocs] = useState([]);
  
  const profileImageInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(apiUrl("/api/worker/profile"), {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.data.data) {
          const profileData = {
            ...res.data.data,
            skills: res.data.data.skills ? res.data.data.skills.join(", ") : "",
            phone: res.data.data.userId?.phone || "",
          };
          setVerificationStatus(res.data.data.verificationStatus);
          reset(profileData);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDocsChange = (e) => {
    setSelectedDocs(Array.from(e.target.files));
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append("bio", data.bio || "");
      formData.append("skills", data.skills || "");
      formData.append("experience", data.experience || "");
      formData.append("availability", data.availability || "Available");
      formData.append("pricing", data.pricing || 0);
      formData.append("pricingType", data.pricingType || "Hourly");
      formData.append("city", data.city || "");
      formData.append("phone", data.phone || "");

      // Append files
      if (profileImageInputRef.current.files[0]) {
        formData.append("profileImage", profileImageInputRef.current.files[0]);
      }
      
      if (selectedDocs.length > 0) {
        selectedDocs.forEach(doc => {
          formData.append("verificationDocs", doc);
        });
      }

      const res = await axios.put(apiUrl("/api/worker/profile"), formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      setVerificationStatus(res.data.data.verificationStatus);
      
      // Update global user context if profile image changed
      if (res.data.data.userId.profileImage !== user.profileImage) {
         login({ ...user, profileImage: res.data.data.userId.profileImage }, localStorage.getItem("token"));
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
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
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header Card */}
      <div className="glass-card p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 relative z-10 w-full">
          <div className="relative group">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner overflow-hidden border-4 border-white dark:border-slate-800">
              {profileImagePreview || user?.profileImage ? (
                <img
                  src={profileImagePreview || user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-16 h-16 opacity-50" />
              )}
            </div>
            <button 
              onClick={() => profileImageInputRef.current.click()}
              className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
              title="Change Profile Picture"
            >
              <Upload size={14} />
            </button>
            <input 
              type="file" 
              ref={profileImageInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {user?.name}
              {verificationStatus === 'Approved' && <ShieldCheck className="text-green-500" size={24} />}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
                {user?.role}
              </span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                verificationStatus === 'Approved' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                verificationStatus === 'Pending' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                verificationStatus === 'Rejected' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {verificationStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Professional Details
          </h2>
          <form id="profileForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Bio / About Me</label>
              <textarea
                {...register("bio")}
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                placeholder="Tell employers about yourself..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Skills (comma separated)</label>
              <input
                {...register("skills")}
                type="text"
                className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                placeholder="e.g. Plumbing, Electrical, Carpentry"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Experience (Years)
                </label>
                <input
                  {...register("experience")}
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Availability</label>
                <select
                  {...register("availability")}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                >
                  <option value="Available">Available (Full-time)</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Not Available">Currently Unavailable</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> City/Location
                </label>
                <input
                  {...register("city")}
                  type="text"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                  placeholder="e.g. Bangalore, Karnataka"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                  placeholder="e.g. +91 9876543210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-2">
                <div className="w-2/3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Pricing Rate (₹)
                  </label>
                  <input
                    {...register("pricing")}
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                    placeholder="e.g. 500"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">&nbsp;</label>
                  <select
                    {...register("pricingType")}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                  >
                    <option value="Hourly">/ hr</option>
                    <option value="Daily">/ day</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Verification Card */}
        <div className="glass-card p-8 rounded-2xl h-fit">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Get Verified
          </h2>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Verified workers receive up to <span className="font-bold text-slate-900 dark:text-slate-200">3x more jobs</span>. Upload your Aadhar Card and Police Verification to get the verified badge.
              </p>
            </div>
          </div>
          
          <div className="mb-6">
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Upload Documents (PDF/Images)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input 
                type="file" 
                multiple 
                accept=".pdf,image/*"
                onChange={handleDocsChange}
                className="hidden" 
                id="doc-upload" 
              />
              <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Click to browse files</span>
                <span className="text-xs text-slate-500 mt-1">Max 5 files (Aadhar, ID, etc.)</span>
              </label>
            </div>
            {selectedDocs.length > 0 && (
              <div className="mt-3 space-y-1">
                {selectedDocs.map((doc, idx) => (
                  <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 truncate">✓ {doc.name}</p>
                ))}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            form="profileForm"
            disabled={saving}
            className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkerProfile;
