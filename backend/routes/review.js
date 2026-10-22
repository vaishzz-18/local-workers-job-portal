const express = require("express");
const router = express.Router();
const {
  createReview,
  getWorkerReviews
} = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.post("/", protect, authorize("employer"), upload.array("photos", 5), createReview);
router.get("/worker/:workerId", getWorkerReviews);

module.exports = router;
