import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Briefcase,
  Users,
  Star,
  ArrowRight,
  Zap,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const dashboardLink =
    user?.role === "Worker"
      ? "/worker"
      : user?.role === "Employer"
        ? "/employer"
        : "/admin";

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div
          className="lg:w-1/2 space-y-8 z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/60 backdrop-blur-md border border-indigo-100 dark:border-indigo-800 shadow-sm text-indigo-700 dark:text-indigo-300 font-semibold text-sm"
          >
            <Zap className="w-4 h-4 text-orange-500" />
            <span>The #1 Local Job Matching Platform</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl lg:text-7xl font-extrabold leading-tight text-slate-900 dark:text-white"
          >
            Find the Perfect <br />
            <span className="gradient-text">Local Talent</span> Instantly.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium"
          >
            Connect with skilled workers in your area or find your next gig.
            JobConnect makes local hiring fast, safe, and incredibly easy.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            {user ? (
              <Link
                to={dashboardLink}
                className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all hover:shadow-[0_0_20px_rgba(15,23,42,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all hover:shadow-[0_0_20px_rgba(15,23,42,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Start Hiring <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-bold rounded-2xl hover:bg-indigo-50 dark:bg-indigo-900/30 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center"
                >
                  Find Work
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Hero Illustration / Floating Cards */}
        <motion.div
          className="lg:w-1/2 relative h-[500px] w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Decorative central circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

          {/* Floating Card 1 */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-10 right-10 glass-card p-4 rounded-2xl flex items-center gap-4 w-64 z-20"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-500">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Raju Kumar
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Top Rated Electrician
              </p>
            </div>
          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-20 left-4 glass-card p-5 rounded-2xl w-72 z-20"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-bold rounded-lg">
                Urgent
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">
              Office Plumbing Fix
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Hubli, KA
            </p>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-3/4"></div>
            </div>
          </motion.div>

          {/* Floating Card 3 */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute top-1/2 right-0 glass-card p-4 rounded-2xl flex items-center gap-3 z-10"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-slate-700 dark:text-slate-200">
              Verified Profiles
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white dark:bg-slate-800 py-24 relative z-20 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)] rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Why Choose{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                JobConnect
              </span>
              ?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Experience the most vibrant and efficient way to connect with
              local talent and opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 transition-all hover:shadow-xl group"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Smart Matching
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Our algorithm instantly connects employers with the most
                relevant and highly-rated local workers based on skills and
                proximity.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 transition-all hover:shadow-xl group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">
                Direct Communication
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">
                Chat, negotiate, and finalize details directly on the platform.
                No middlemen, no hidden fees, just pure connectivity.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 transition-all hover:shadow-xl group"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/50 text-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Verified Trust
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Every profile is verified, and our robust rating system ensures
                you're hiring reliable, top-quality professionals every time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Hide if logged in */}
      {!user && (
        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <div className="relative rounded-3xl overflow-hidden gradient-bg p-12 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-slate-800/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

            <h2 className="text-4xl font-extrabold text-white mb-6 relative z-10">
              Ready to transform how you work?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of locals who are already using JobConnect to grow
              their businesses and find daily work.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block relative z-10"
            >
              <Link
                to="/register"
                className="px-10 py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                Create Your Free Account <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
