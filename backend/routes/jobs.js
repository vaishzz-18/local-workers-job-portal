const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { applyForJob } = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/").get(getJobs).post(protect, authorize("employer"), createJob);

router
  .route("/:id")
  .get(getJobById)
  .put(protect, authorize("employer"), updateJob)
  .delete(protect, authorize("employer"), deleteJob);

router.post("/:id/apply", protect, authorize("worker"), applyForJob);

module.exports = router;
