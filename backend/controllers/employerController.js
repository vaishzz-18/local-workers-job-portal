const EmployerProfile = require("../models/EmployerProfile");

// @desc    Get employer profile
// @route   GET /api/employer/profile
// @access  Employer
const getEmployerProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({
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

// @desc    Update employer profile
// @route   PUT /api/employer/profile
// @access  Employer
const updateEmployerProfile = async (req, res) => {
  try {
    const { companyName, description } = req.body;

    let profile = await EmployerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    profile = await EmployerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { companyName, description },
      { new: true, runValidators: true },
    );

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmployerProfile,
  updateEmployerProfile,
};
