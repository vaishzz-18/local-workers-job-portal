const WorkerProfile = require("../models/WorkerProfile");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc    Get worker profile
// @route   GET /api/worker/profile
// @access  Worker
const getWorkerProfile = async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({
      userId: req.user.id,
    }).populate("userId", "name email phone location profileImage");
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update worker profile
// @route   PUT /api/worker/profile
// @access  Worker
const updateWorkerProfile = async (req, res) => {
  try {
    const { skills, experience, availability, bio, pricing, pricingType, city, phone } = req.body;

    let profile = await WorkerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Handle File Uploads (Cloudinary)
    if (req.files) {
      if (req.files.profileImage) {
        await User.findByIdAndUpdate(req.user.id, { profileImage: req.files.profileImage[0].path });
      }
    }
    
    // Verify if documents were added and status became pending
    let newPendingVerification = false;

    if (req.files && req.files.verificationDocs) {
      const docs = req.files.verificationDocs;
      
      const newDocs = Array.isArray(docs) 
        ? docs.map((doc) => ({ name: doc.originalname, url: doc.path }))
        : [{ name: docs[0].originalname, url: docs[0].path }];
        
      if (!profile.documents) {
        profile.documents = [];
      }
        
      profile.documents.push(...newDocs);
      
      if (profile.verificationStatus !== "Approved") {
        profile.verificationStatus = "Pending";
        newPendingVerification = true;
      }
    }

    await profile.save();

    // If a new verification request was made, notify all admins
    if (newPendingVerification) {
      const admins = await User.find({ role: "admin" });
      
      for (const admin of admins) {
        const notification = await Notification.create({
          userId: admin._id,
          message: `${req.user.name || "A worker"} has uploaded documents for verification.`,
          type: "verification",
          link: "/admin", // Dashboard where verifications are managed
        });

        const io = req.app.get("io");
        if (io) {
          io.to(admin._id.toString()).emit("new_notification", notification);
        }
      }
    }

    // Update User fields if any
    if (phone || city) {
      const updateData = {};
      if (phone) updateData.phone = phone;
      if (city) updateData.location = city;
      await User.findByIdAndUpdate(req.user.id, updateData);
    }

    // Update textual fields
    if (skills) {
      // If skills come as comma separated string from FormData
      profile.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    }
    if (experience) profile.experience = experience;
    if (availability) profile.availability = availability;
    if (bio) profile.bio = bio;
    if (pricing) profile.pricing = pricing;
    if (pricingType) profile.pricingType = pricingType;
    if (city) profile.city = city;

    await profile.save();
    
    // Re-fetch to populate User fields
    const updatedProfile = await WorkerProfile.findById(profile._id).populate("userId", "name email phone location profileImage");

    res.json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error("Worker Profile Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all workers (for employers)
// @route   GET /api/employer/workers
// @access  Employer
const getAllWorkers = async (req, res) => {
  try {
    const profiles = await WorkerProfile.find({ verificationStatus: "Approved" }).populate(
      "userId",
      "name email phone location profileImage",
    );
    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWorkerProfile,
  updateWorkerProfile,
  getAllWorkers,
};
