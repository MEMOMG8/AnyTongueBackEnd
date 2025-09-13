const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api', require('./routes/api.routes'));
app.use('/api/chats', require('./routes/chat.routes'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join chat room
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Leave chat room
  socket.on('leave-chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to other modules
app.set('io', io);


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
