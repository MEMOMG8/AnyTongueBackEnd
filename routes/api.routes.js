const express = require('express');
const { sendMessage, getMessages } = require('../controllers/message.controller');
const { createChat, getUserChats, deleteChat } = require('../controllers/chat.controller');
const { createUser, loginUser, getUserProfile, updateUserProfile, findUserByUsername } = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.post('/users', createUser);
router.post('/users/login', loginUser);

// Protected routes (authentication required)
router.get('/user/profile', authenticateToken, getUserProfile);
router.put('/user/profile', authenticateToken, updateUserProfile);
router.get('/users/username/:username', authenticateToken, findUserByUsername);
router.post('/chats', authenticateToken, createChat);
router.get('/users/:userId/chats', authenticateToken, getUserChats);
router.delete('/chats/:chatId', authenticateToken, deleteChat);
router.post('/chats/:chatId/messages', authenticateToken, sendMessage);
router.get('/chats/:chatId/messages', authenticateToken, getMessages);

module.exports = router;
