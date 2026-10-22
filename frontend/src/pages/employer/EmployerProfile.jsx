import { apiUrl } from "../../config/api";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Building, Save, Loader2 } from "lucide-react";
const EmployerProfile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          apiUrl("/api/employer/profile"),
        );
        if (res.data.data) {
          reset(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);
  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await axios.put(apiUrl("/api/employer/profile"), data);
      toast.success("Company profile updated successfully!");
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
      className="max-w-3xl mx-auto space-y-6"
    >
      {" "}
      <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        {" "}
        <div className="flex items-center gap-6 relative z-10">
          {" "}
          <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner">
            {" "}
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Building className="w-12 h-12" />
            )}{" "}
          </div>{" "}
          <div>
            {" "}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {user?.name}
            </h1>{" "}
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {user?.email}
            </p>{" "}
            <span className="inline-block mt-2 px-3 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {" "}
              {user?.role}{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
        {" "}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          {" "}
          <Building className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />{" "}
          Company Details{" "}
        </h2>{" "}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {" "}
          <div>
            {" "}
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Company Name
            </label>{" "}
            <input
              {...register("companyName")}
              type="text"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. Acme Corp"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Company Description
            </label>{" "}
            <textarea
              {...register("description")}
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Tell workers about your company and culture..."
            />{" "}
          </div>{" "}
          <div className="pt-4 flex justify-end">
            {" "}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-70"
            >
              {" "}
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}{" "}
              {saving ? "Saving..." : "Save Profile"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </motion.div>
  );
};
export default EmployerProfile;
