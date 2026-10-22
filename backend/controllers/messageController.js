const Message = require("../models/Message");
const User = require("../models/User");
const Application = require("../models/Application");

// Get messages between current user and another user
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    }).sort('createdAt');

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get list of users the current user can chat with
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const role = req.user.role;

    // Find all applications where status is 'Approved'
    const chatUsersIds = new Set();
    
    // 1. Users from approved applications
    if (role === 'employer') {
      const applications = await Application.find({ employerId: currentUserId, status: 'Approved' });
      applications.forEach(app => chatUsersIds.add(app.workerId.toString()));
    } else if (role === 'worker') {
      const applications = await Application.find({ workerId: currentUserId, status: 'Approved' });
      applications.forEach(app => chatUsersIds.add(app.employerId.toString()));
    }

    // 2. Users from message history (organic chats)
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
    });
    messages.forEach(msg => {
      if (msg.senderId.toString() !== currentUserId) chatUsersIds.add(msg.senderId.toString());
      if (msg.receiverId.toString() !== currentUserId) chatUsersIds.add(msg.receiverId.toString());
    });

    const chatUsers = await User.find({ _id: { $in: Array.from(chatUsersIds) } })
      .select('name email profileImage role');

    res.json({ success: true, data: chatUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMessages, getConversations };
