const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Worker
const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const workerId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, workerId });
    if (existingApplication) {
      return res
        .status(400)
        .json({ success: false, message: "Already applied for this job" });
    }

    const application = await Application.create({
      workerId,
      jobId,
      employerId: job.employerId,
    });

    // Create Notification for Employer
    const notification = await Notification.create({
      userId: job.employerId,
      message: `A new worker has applied for your job: ${job.title}`,
      type: "application",
      link: `/employer`, // Route them to their dashboard
    });

    // Emit Real-time Notification
    const io = req.app.get("io");
    if (io) {
      io.to(job.employerId.toString()).emit("new_notification", notification);
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get worker's applications
// @route   GET /api/applications
// @access  Worker
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      workerId: req.user.id,
    }).populate("jobId", "title category location");
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applicants for a job
// @route   GET /api/job/:id/applicants
// @access  Employer
const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Verify job ownership
    const job = await Job.findById(jobId);
    if (!job || job.employerId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const applications = await Application.find({ jobId }).populate(
      "workerId",
      "name email phone location",
    );
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/employer/applications/:id/status
// @access  Employer
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("jobId", "title");
    
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Verify ownership
    if (application.employerId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    // Create Notification for Worker
    const notification = await Notification.create({
      userId: application.workerId,
      message: `Your application for '${application.jobId.title}' has been ${status.toLowerCase()}`,
      type: "status",
      link: `/worker`, // Route them to dashboard
    });

    // Emit Real-time Notification
    const io = req.app.get("io");
    if (io) {
      io.to(application.workerId.toString()).emit("new_notification", notification);
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
};
