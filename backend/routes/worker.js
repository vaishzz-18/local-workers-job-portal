const express = require("express");
const router = express.Router();
const {
  getWorkerProfile,
  updateWorkerProfile,
} = require("../controllers/workerController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router
  .route("/profile")
  .get(protect, authorize("worker"), getWorkerProfile)
  .put(
    protect, 
    authorize("worker"), 
    upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'verificationDocs', maxCount: 5 }]), 
    updateWorkerProfile
  );

module.exports = router;
