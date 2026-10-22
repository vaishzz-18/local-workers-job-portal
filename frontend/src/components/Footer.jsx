import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

const Footer = () => {
  const { user } = useContext(AuthContext);

  return (
    <footer className="w-full mt-auto relative z-20">
      {/* Top CTA Section - Only show if not logged in */}
      {!user && (
        <div className="relative overflow-hidden gradient-bg py-24 px-4 text-center text-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-slate-800/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 relative z-10">
            Ready to Get Started?
          </h2>
          <p className="text-indigo-100 mb-10 max-w-2xl mx-auto text-lg relative z-10 font-medium">
            Join thousands of workers and employers already using JobConnect to
            grow and succeed.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block relative z-10"
          >
            <Link
              to="/register"
              className="px-10 py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              Create Free Account
            </Link>
          </motion.div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="bg-white dark:bg-slate-800 pt-16 pb-8 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Logo and About */}
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6 group">
                <div className="gradient-bg p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  JobConnect
                </span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                The most vibrant and efficient platform connecting local talent
                with amazing opportunities.
              </p>
            </div>

            {/* Admin receives a clean footer, hide these columns */}
            {(!user || user.role !== "admin") && (
              <>
                {/* Quick Links */}
                <div className="col-span-1">
                  <h4 className="font-extrabold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">
                    Quick Links
                  </h4>
                  <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <li>
                      <Link
                        to="/worker/jobs"
                        className="hover:text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
                        Browse Jobs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/employer"
                        className="hover:text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
                        Find Workers
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="hover:text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
                        Register
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* For Users */}
                <div className="col-span-1">
                  <h4 className="font-extrabold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">
                    For Users
                  </h4>
                  <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <li>
                      <Link
                        to="/login"
                        className="hover:text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span>
                        Worker Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="hover:text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span>
                        Employer Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="hover:text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span>
                        Admin Login
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Contact Us */}
                <div className="col-span-1">
                  <h4 className="font-extrabold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">
                    Contact Us
                  </h4>
                  <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-500 dark:text-indigo-400 border border-slate-100 dark:border-slate-700">
                        <Mail size={14} />
                      </div>
                      <a
                        href="mailto:support@jobconnect.com"
                        className="hover:text-indigo-600 dark:text-indigo-400 transition-colors"
                      >
                        support@jobconnect.com
                      </a>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-500 dark:text-indigo-400 border border-slate-100 dark:border-slate-700">
                        <Phone size={14} />
                      </div>
                      <span>+91 98765 43210</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-500 dark:text-indigo-400 border border-slate-100 dark:border-slate-700">
                        <MapPin size={14} />
                      </div>
                      <span>Hubli, Karnataka, India</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-slate-400">
            <p>&copy; 2025 JobConnect. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="hover:text-indigo-600 dark:text-indigo-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-indigo-600 dark:text-indigo-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
