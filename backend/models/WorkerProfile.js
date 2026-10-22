const mongoose = require("mongoose");

const workerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  experience: {
    type: Number, // In years
    default: 0,
  },
  availability: {
    type: String,
    enum: ["Available", "Not Available", "Part-Time"],
    default: "Available",
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  verificationStatus: {
    type: String,
    enum: ["Unverified", "Pending", "Approved", "Rejected"],
    default: "Unverified",
  },
  documents: [
    {
      name: String,
      url: String,
    },
  ],
  pricing: {
    type: Number,
    default: 0,
  },
  pricingType: {
    type: String,
    enum: ["Hourly", "Daily", "Fixed"],
    default: "Hourly",
  },
  city: {
    type: String,
  },
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  jobsCompleted: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WorkerProfile", workerProfileSchema);
