import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Capitalized Roles check from DB model (PROMPT.md says Role-based, usually capitalized or lowercase, let's normalize)
  const role = user.role?.toLowerCase();

  if (role === "worker") return <Navigate to="/worker" replace />;
  if (role === "employer") return <Navigate to="/employer" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;

  // Fallback
  return <Navigate to="/" replace />;
};

export default Dashboard;
