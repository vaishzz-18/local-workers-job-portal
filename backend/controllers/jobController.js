const Job = require("../models/Job");
const Application = require("../models/Application");

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public or Worker
const getJobs = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: "Open" };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const jobs = await Job.find(query).populate(
      "employerId",
      "name companyName",
    ).lean();

    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const applicantCount = await Application.countDocuments({ jobId: job._id });
      return { ...job, applicantCount };
    }));

    res.json({ success: true, data: jobsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public or Worker
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employerId",
      "name companyName",
    );
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Employer
const createJob = async (req, res) => {
  try {
    req.body.employerId = req.user.id;
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Employer
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Make sure user is job owner
    if (job.employerId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Employer
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Make sure user is job owner
    if (job.employerId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    // Cascade delete applications
    await Application.deleteMany({ jobId: job._id });
    await job.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employer's jobs
// @route   GET /api/employer/jobs
// @access  Employer
const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user.id }).lean();
    
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const applicantCount = await Application.countDocuments({ jobId: job._id });
      const hiredCount = await Application.countDocuments({ jobId: job._id, status: { $in: ['Approved', 'Completed'] } });
      return { ...job, applicantCount, hiredCount };
    }));

    res.json({ success: true, data: jobsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
};
