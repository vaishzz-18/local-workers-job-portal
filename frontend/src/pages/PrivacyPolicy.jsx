import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-10 rounded-3xl shadow-xl"
      >
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-2xl text-white shadow-xl flex items-center justify-center shrink-0">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-8 text-slate-600 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="leading-relaxed">
              We collect information you provide directly to us when creating an account, including your name, email address, phone number, and location. For workers, this also includes profile photos, skills, verification documents (such as Aadhaar or Police verification), and employment history.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed">
              We use the information we collect to operate, maintain, and improve the JobConnect platform. This includes connecting workers with employers, facilitating secure messaging, verifying worker identities to ensure platform safety, and providing customer support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              3. Data Sharing and Disclosure
            </h2>
            <p className="leading-relaxed">
              We do not sell your personal data. We share your public profile (such as skills, name, and ratings) with employers on the platform to facilitate hiring. Secure documents uploaded for verification are only accessible to platform Administrators and are never shared publicly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              4. Security
            </h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your personal information. All uploaded documents are stored securely via encrypted third-party services. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              5. Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at <strong>support@jobconnect.com</strong>.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
