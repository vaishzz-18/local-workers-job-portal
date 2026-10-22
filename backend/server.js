const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const Notification = require("./models/Notification");
const User = require("./models/User");

// Load env vars
dotenv.config();

// Database connection is awaited before the server starts.

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header, such as health checks.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  }
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

// Middleware
app.use(express.json());

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Socket.io logic
io.on("connection", (socket) => {
  socket.on("join_room", (userId) => {
    socket.join(userId);
  });

  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, text } = data;
      const message = await Message.create({ senderId, receiverId, text });
      
      // Emit to receiver
      io.to(receiverId).emit("receive_message", message);
      // Emit back to sender
      socket.emit("receive_message", message);

      // Create notification
      const sender = await User.findById(senderId);
      if (sender) {
        const notifMessage = `New message from ${sender.name}`;
        const existingUnread = await Notification.findOne({
          userId: receiverId,
          type: "message",
          isRead: false,
          message: notifMessage
        });
        
        if (!existingUnread) {
          const newNotif = await Notification.create({
            userId: receiverId,
            message: notifMessage,
            type: "message",
            link: "/chat"
          });
          io.to(receiverId).emit("new_notification", newNotif);
        }
      }
    } catch (error) {
      console.error("Error sending message", error);
    }
  });

  socket.on("disconnect", () => {});
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/employer", require("./routes/employer"));
app.use("/api/worker", require("./routes/worker"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/reviews", require("./routes/review"));
app.use("/api/messages", require("./routes/message"));
app.use("/api/notifications", require("./routes/notifications"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Caught:", err);
  res.status(500).json({ success: false, message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
