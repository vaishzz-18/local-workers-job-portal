import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-10 rounded-3xl shadow-xl"
      >
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 p-4 rounded-2xl text-white shadow-xl flex items-center justify-center shrink-0">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-8 text-slate-600 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using the JobConnect platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              2. User Roles and Responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li><strong>Workers:</strong> Must provide accurate information and legitimate verification documents. Workers are expected to fulfill accepted jobs to the best of their ability.</li>
              <li><strong>Employers:</strong> Must post legitimate jobs and treat workers fairly. Employers are expected to leave honest feedback upon job completion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              3. Platform Verification
            </h2>
            <p className="leading-relaxed">
              JobConnect requires workers to submit verification documents before they can be discovered by employers. We reserve the right to approve, reject, or revoke verification status at our sole discretion based on platform safety guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              4. User Content and Reviews
            </h2>
            <p className="leading-relaxed">
              Users may submit reviews, photos, and messages. You retain ownership of your content, but grant JobConnect a license to display it. Harassment, hate speech, or uploading inappropriate content will result in immediate account termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              5. Liability
            </h2>
            <p className="leading-relaxed">
              JobConnect acts solely as a matching platform. We do not guarantee the quality, safety, or legality of jobs posted or the performance of workers. Any agreements or contracts formed are strictly between the employer and the worker.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;
