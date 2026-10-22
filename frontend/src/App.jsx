import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Common Dashboard (Redirects based on role)
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

// Worker Pages
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerProfile from "./pages/worker/WorkerProfile";
import BrowseJobs from "./pages/worker/BrowseJobs";
import JobDetails from "./pages/worker/JobDetails";
import MyApplications from "./pages/worker/MyApplications";

// Employer Pages
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerProfile from "./pages/employer/EmployerProfile";
import PostJob from "./pages/employer/PostJob";
import ManageJobs from "./pages/employer/ManageJobs";
import JobApplicants from "./pages/employer/JobApplicants";
import FindWorkers from "./pages/employer/FindWorkers";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAllJobs from "./pages/admin/ManageAllJobs";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans text-slate-900 dark:text-white bg-slate-50 selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden dark:bg-slate-900 dark:text-slate-50 transition-colors duration-300">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <Navbar />
            <main className="flex-grow z-10">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />

                {/* Common Protected Route */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />

                {/* Worker Routes */}
                <Route
                  path="/worker"
                  element={
                    <ProtectedRoute allowedRoles={["Worker"]}>
                      <WorkerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/worker/profile"
                  element={
                    <ProtectedRoute allowedRoles={["Worker"]}>
                      <WorkerProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/worker/jobs"
                  element={
                    <ProtectedRoute allowedRoles={["Worker"]}>
                      <BrowseJobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/worker/jobs/:id"
                  element={
                    <ProtectedRoute allowedRoles={["Worker"]}>
                      <JobDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/worker/applications"
                  element={
                    <ProtectedRoute allowedRoles={["Worker"]}>
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />

                {/* Employer Routes */}
                <Route
                  path="/employer"
                  element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                      <EmployerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/profile"
                  element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                      <EmployerProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/post-job"
                  element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                      <PostJob />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/jobs"
                  element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                      <ManageJobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/jobs/:jobId/applicants"
                  element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                      <JobApplicants />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/workers"
                  element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                      <FindWorkers />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <ManageUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/jobs"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <ManageAllJobs />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  "bg-white text-slate-800 shadow-xl border border-slate-200",
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
