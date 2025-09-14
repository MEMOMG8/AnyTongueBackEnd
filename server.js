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

// Socket.IO connection handling
io.on('connection', (socket) => {
  // Join chat room
  socket.on('join-chat', (data) => {
    const chatId = data.chatId || data;
    socket.join(chatId);
  });

  // Leave chat room
  socket.on('leave-chat', (data) => {
    const chatId = data.chatId || data;
    socket.leave(chatId);
  });
});

// Make io available to other modules
app.set('io', io);


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
