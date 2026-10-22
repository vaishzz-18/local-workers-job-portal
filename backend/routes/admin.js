const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  deleteUser,
  deleteAdminJob,
  getVerificationRequests,
  updateVerificationStatus,
  getUserProfile
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.route("/users").get(getUsers);
router.route("/users/:id").delete(deleteUser);
router.get("/users/:id/profile", getUserProfile);
router.delete("/jobs/:id", deleteAdminJob);

router.get("/verifications", getVerificationRequests);
router.put("/verifications/:id", updateVerificationStatus);

module.exports = router;
