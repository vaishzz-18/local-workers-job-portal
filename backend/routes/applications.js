const express = require("express");
const router = express.Router();
const { getMyApplications } = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("worker"), getMyApplications);

module.exports = router;
