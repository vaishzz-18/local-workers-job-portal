const express = require("express");
const router = express.Router();
const { getMessages, getConversations } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/conversations/all", getConversations);
router.get("/:userId", getMessages);

module.exports = router;
