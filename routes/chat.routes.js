const express = require('express');
const { 
  createChat, 
  getUserChats, 
  getChat, 
  deleteChat 
} = require('../controllers/chat.controller');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All chat routes require authentication
router.use(authenticateToken);

// Chat management routes
router.post('/', createChat);
router.get('/user/:userId', getUserChats);
router.get('/:chatId', getChat);
router.delete('/:chatId', deleteChat);

module.exports = router;
