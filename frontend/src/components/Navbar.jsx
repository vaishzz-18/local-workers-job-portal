import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Briefcase, Menu, X, LogOut, User, Zap, Moon, Sun, MessageSquare, Bell, Check, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { io } from "socket.io-client";
import LanguageSelector from "./LanguageSelector";
import { apiUrl, API_URL } from "../config/api";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      fetchNotifications();
      const socket = io(API_URL);
      socket.emit("join_room", user._id || user.id);
      
      socket.on("new_notification", (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => socket.disconnect();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(apiUrl("/api/notifications"), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.data.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(apiUrl(`/api/notifications/${id}/read`), {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(apiUrl("/api/notifications/read-all"), {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm dark:bg-slate-900/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link 
            to={
              user
                ? (user.role || "").toLowerCase() === "worker"
                  ? "/worker"
                  : (user.role || "").toLowerCase() === "employer"
                    ? "/employer"
                    : "/admin"
                : "/"
            } 
            className="flex items-center gap-2 group"
          >
            <div className="gradient-bg p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              JobConnect
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold">
            {(!user || (user.role || "").toLowerCase() === "worker") && (
              <Link
                to="/worker/jobs"
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
              >
                Browse Jobs
              </Link>
            )}
            {(!user || (user.role || "").toLowerCase() === "employer") && (
              <Link
                to="/employer/workers"
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
              >
                Find Workers
              </Link>
            )}

            <LanguageSelector />

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm border border-transparent dark:border-slate-700"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4 ml-2">
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm border border-transparent dark:border-slate-700 relative"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1/3 -translate-y-1/3 border-2 border-white dark:border-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 max-h-[400px] flex flex-col bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                          <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="overflow-y-auto flex-1 p-2">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif._id}
                                onClick={() => {
                                  if (!notif.isRead) markAsRead(notif._id);
                                  if (notif.link) {
                                    navigate(notif.link);
                                    setShowNotifications(false);
                                  }
                                }}
                                className={`p-3 rounded-xl mb-1 cursor-pointer transition-colors flex gap-3 ${!notif.isRead ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                              >
                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!notif.isRead ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-transparent'}`} />
                                <div>
                                  <p className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    {new Date(notif.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {user.role !== "admin" && (
                  <Link
                    to="/chat"
                    className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm border border-transparent dark:border-slate-700"
                  >
                    <MessageSquare size={18} />
                  </Link>
                )}
                <Link
                  to={
                    (user.role || "").toLowerCase() === "worker"
                      ? "/worker"
                      : (user.role || "").toLowerCase() === "employer"
                        ? "/employer"
                        : "/admin"
                  }
                  className="px-5 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/80 rounded-xl transition-colors font-bold"
                >
                  Dashboard
                </Link>
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform">
                    <User size={20} />
                  </div>
                  {/* Dropdown for logout */}
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 font-bold flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-indigo-600 font-bold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 gradient-bg text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center">
            <button
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white/90 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {(!user || (user.role || "").toLowerCase() === "worker") && (
                <Link
                  to="/worker/jobs"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-600 hover:text-indigo-600 font-bold text-lg"
                >
                  Browse Jobs
                </Link>
              )}
              {(!user || (user.role || "").toLowerCase() === "employer") && (
                <Link
                  to="/employer/workers"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-600 hover:text-indigo-600 font-bold text-lg"
                >
                  Find Workers
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    to={
                      (user.role || "").toLowerCase() === "worker"
                        ? "/worker"
                        : (user.role || "").toLowerCase() === "employer"
                          ? "/employer"
                          : "/admin"
                    }
                    onClick={() => setIsOpen(false)}
                    className="text-slate-600 hover:text-indigo-600 font-bold text-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-600 font-bold text-lg"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="py-3 text-center font-bold text-slate-700 bg-slate-50 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="py-3 text-center font-bold text-white gradient-bg rounded-xl shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
