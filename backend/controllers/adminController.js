const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const WorkerProfile = require("../models/WorkerProfile");
const EmployerProfile = require("../models/EmployerProfile");
const Notification = require("../models/Notification");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({ role: { $ne: "admin" } });
    const jobsCount = await Job.countDocuments();
    const applicationsCount = await Application.countDocuments();
    const pendingVerifications = await WorkerProfile.countDocuments({ verificationStatus: "Pending" });

    res.json({
      success: true,
      data: {
        users: usersCount,
        jobs: jobsCount,
        applications: applicationsCount,
        pendingVerifications: pendingVerifications
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Cascading deletes based on role
    if (user.role === "worker") {
      await WorkerProfile.findOneAndDelete({ userId: user._id });
      await Application.deleteMany({ workerId: user._id });
    } else if (user.role === "employer") {
      await EmployerProfile.findOneAndDelete({ userId: user._id });
      // Delete all jobs posted by employer and their applications
      const jobs = await Job.find({ employerId: user._id });
      for (const job of jobs) {
        await Application.deleteMany({ jobId: job._id });
        await job.deleteOne();
      }
    }
    
    // Delete all notifications belonging to the user
    await Notification.deleteMany({ userId: user._id });

    await user.deleteOne();
    res.json({ success: true, message: "User removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job as admin
// @route   DELETE /api/admin/jobs/:id
// @access  Admin
const deleteAdminJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Cascade delete applications
    await Application.deleteMany({ jobId: job._id });
    await job.deleteOne();
    res.json({ success: true, message: "Job removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get verification requests
// @route   GET /api/admin/verifications
// @access  Admin
const getVerificationRequests = async (req, res) => {
  try {
    const requests = await WorkerProfile.find({ verificationStatus: "Pending" }).populate("userId", "name email");
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update verification status
// @route   PUT /api/admin/verifications/:id
// @access  Admin
const updateVerificationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const profile = await WorkerProfile.findByIdAndUpdate(req.params.id, { verificationStatus: status }, { new: true });
    
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    
    // Create Notification for Worker
    const notification = await Notification.create({
      userId: profile.userId,
      message: `Your account verification has been ${status.toLowerCase()}`,
      type: "verification",
      link: `/worker`,
    });

    // Emit Real-time Notification
    const io = req.app.get("io");
    if (io) {
      io.to(profile.userId.toString()).emit("new_notification", notification);
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile (Worker or Employer)
// @route   GET /api/admin/users/:id/profile
// @access  Admin
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profile = null;
    if (user.role === "worker") {
      profile = await WorkerProfile.findOne({ userId: user._id });
    } else if (user.role === "employer") {
      profile = await EmployerProfile.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  deleteUser,
  deleteAdminJob,
  getVerificationRequests,
  updateVerificationStatus,
  getUserProfile
};
