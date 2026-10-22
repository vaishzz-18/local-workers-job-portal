import { apiUrl } from "../config/api";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "worker";

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        apiUrl("/api/auth/register"),
        data,
      );
      if (res.data.success) {
        login(res.data, res.data.token);
        toast.success("Registration successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center p-4 relative z-10 my-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg glass-card rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-40 h-40 bg-pink-500 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 opacity-20"></div>

        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Join JobConnect and start your journey
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 relative z-10"
        >
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 ml-1">
              Full Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-bold">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-bold">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-bold">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 ml-1">
              I am a...
            </label>
            <select
              {...register("role")}
              defaultValue={defaultRole}
              className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm appearance-none"
            >
              <option value="worker">Worker (Looking for jobs)</option>
              <option value="employer">Employer (Looking to hire)</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 gradient-bg text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all mt-4"
          >
            Create Account
          </motion.button>
        </form>

        <p className="text-center mt-8 text-slate-600 dark:text-slate-300 font-medium relative z-10">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
