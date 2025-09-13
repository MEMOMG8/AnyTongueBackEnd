const Message = require('../models/message.model');
const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const { getTranslations } = require('../services/translation.service');
const jwt = require('jsonwebtoken');

/**
 * Send a message to a chat
 * Implements the "Translate on Write" strategy
 */
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { originalText } = req.body;
    const senderId = req.user._id; // Get from authenticated user

    // Validate input
    if (!originalText) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    // TODO: Implement the "Translate on Write" logic:
    // 1. Find the chat and validate it exists
    // 2. Get all participants in the chat
    // 3. Get each participant's native language
    // 4. Call Gemini API to translate the message into each language
    // 5. Save the message with translations to MongoDB
    // 6. Broadcast the complete message object to all clients in the chat room

    // Find the chat and validate it exists
    const chat = await Chat.findById(chatId).populate('participants');
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat room not found'
      });
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(
      participant => participant._id.toString() === senderId.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - not a participant in this chat room'
      });
    }

    // Get sender and receiver languages
    const senderLanguage = req.user.nativeLanguage;
    const receiver = chat.participants.find(p => p._id.toString() !== senderId.toString());
    const receiverLanguage = receiver.nativeLanguage;
    
    // Only translate if sender and receiver have different languages
    let translations = {};
    if (senderLanguage !== receiverLanguage) {
      translations = await getTranslations(originalText, [receiverLanguage]);
    }
    
    // Always include sender's original text
    translations[senderLanguage] = originalText;

    // Create message object
    const messageData = {
      sender: senderId,
      chat: chatId,
      originalText,
      translations
    };

    // Save message to database
    const message = new Message(messageData);
    await message.save();

    // Populate sender information for the response
    await message.populate('sender', 'username nativeLanguage');

    // Broadcast message to all clients in the chat room
    const io = req.app.get('io');
    io.to(chatId).emit('new-message', message);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get messages for a specific chat
 */
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username nativeLanguage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: messages.reverse() // Return in chronological order
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};



module.exports = {
  sendMessage,
  getMessages
};
