const Review = require("../models/Review");
const Application = require("../models/Application");
const WorkerProfile = require("../models/WorkerProfile");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Job = require("../models/Job");

// @desc    Create a review
// @route   POST /api/reviews
// @access  Employer
const createReview = async (req, res) => {
  try {
    const { jobId, workerId, rating, feedback } = req.body;
    
    // Check if employer actually hired this worker for this job
    const application = await Application.findOne({ jobId, workerId, employerId: req.user.id, status: 'Approved' });
    if (!application) {
      return res.status(403).json({ success: false, message: "Can only review hired workers" });
    }

    // Process uploaded photos
    let photos = [];
    if (req.files && req.files.length > 0) {
      photos = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const review = await Review.create({
      jobId,
      workerId,
      employerId: req.user.id,
      rating: Number(rating),
      feedback,
      photos
    });

    // Update WorkerProfile rating and jobs completed
    const workerProfile = await WorkerProfile.findOne({ userId: workerId });
    if (workerProfile) {
      const allReviews = await Review.find({ workerId });
      const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
      workerProfile.rating = avgRating;
      workerProfile.reviewCount = allReviews.length;
      workerProfile.jobsCompleted = (workerProfile.jobsCompleted || 0) + 1;
      await workerProfile.save();
    }

    // Send Notification to Worker
    const employer = await User.findById(req.user.id);
    if (employer) {
      const notif = await Notification.create({
        userId: workerId,
        message: `You received a new ${rating}-star review from ${employer.name}!`,
        type: "review",
        link: "/worker/profile"
      });

      const io = req.app.get("io");
      if (io) {
        io.to(workerId.toString()).emit("new_notification", notif);
      }
    }

    // Close the Job
    await Job.findByIdAndUpdate(jobId, { status: "Closed" });

    // Mark the Application as Completed
    application.status = "Completed";
    await application.save();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a worker
// @route   GET /api/reviews/worker/:workerId
// @access  Public
const getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId })
      .populate('employerId', 'name companyName')
      .populate('jobId', 'title category')
      .sort('-createdAt');
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getWorkerReviews
};
