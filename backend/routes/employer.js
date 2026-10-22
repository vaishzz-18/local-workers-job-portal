const express = require("express");
const router = express.Router();
const { getEmployerJobs } = require("../controllers/jobController");
const { getJobApplicants, updateApplicationStatus } = require("../controllers/applicationController");
const { getAllWorkers } = require("../controllers/workerController");
const {
  getEmployerProfile,
  updateEmployerProfile,
} = require("../controllers/employerController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/profile")
  .get(protect, authorize("employer"), getEmployerProfile)
  .put(protect, authorize("employer"), updateEmployerProfile);

router.get("/jobs", protect, authorize("employer"), getEmployerJobs);
router.get("/workers", protect, authorize("employer"), getAllWorkers);
router.get(
  "/jobs/:id/applicants",
  protect,
  authorize("employer"),
  getJobApplicants,
);
router.put(
  "/applications/:id/status",
  protect,
  authorize("employer"),
  updateApplicationStatus
);

module.exports = router;
