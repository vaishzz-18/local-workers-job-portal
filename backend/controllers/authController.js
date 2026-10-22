const User = require("../models/User");
const WorkerProfile = require("../models/WorkerProfile");
const EmployerProfile = require("../models/EmployerProfile");
const Notification = require("../models/Notification");
const generateToken = require("../utils/generateToken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      location,
    });

    if (user) {
      // Create associated profile based on role
      if (role === "worker") {
        await WorkerProfile.create({ userId: user._id, skills: [] });
      } else if (role === "employer") {
        await EmployerProfile.create({ userId: user._id });
      }

      // Notify Admin of new registration
      try {
        const admins = await User.find({ role: "admin" });
        for (const admin of admins) {
          const notification = await Notification.create({
            userId: admin._id,
            message: `New ${role} registered: ${user.name}`,
            type: "system",
            link: "/admin",
          });
          const io = req.app.get("io");
          if (io) {
            io.to(admin._id.toString()).emit("new_notification", notification);
          }
        }
      } catch (err) {
        console.error("Failed to notify admins of new user", err);
      }

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Special case: Single hardcoded Admin login
    if (email === "admin@jobconnect.com" && password === "admin123") {
      let adminUser = await User.findOne({ email });

      // Seed the admin user if it doesn't exist yet
      if (!adminUser) {
        adminUser = await User.create({
          name: "Super Admin",
          email: "admin@jobconnect.com",
          password: "admin123",
          role: "admin",
          phone: "0000000000",
          location: "Headquarters",
        });
      }

      return res.json({
        success: true,
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        token: generateToken(adminUser._id),
      });
    }

    // Check for standard user email
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user / clear cookie if we were using cookies
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  // Since we are using JWT in headers, the client handles logout by removing the token.
  // We can just send a success message.
  res.json({ success: true, message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
