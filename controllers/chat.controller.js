const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const Message = require('../models/message.model');

/**
 * Create a new chat with another user
 */
const createChat = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.user._id;

    // Validate input
    if (!otherUserId) {
      return res.status(400).json({
        success: false,
        message: 'Other user ID is required'
      });
    }

    // Check if trying to chat with self
    if (otherUserId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create chat with yourself'
      });
    }

    // Verify the other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if chat already exists between these two users
    const existingChat = await Chat.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    });

    if (existingChat) {
      // Populate and return existing chat
      await existingChat.populate('participants', 'username email nativeLanguage');
      await existingChat.populate('createdBy', 'username email');
      
      return res.json({
        success: true,
        message: 'Chat already exists',
        data: existingChat
      });
    }

    // Create new chat
    const chat = new Chat({
      participants: [currentUserId, otherUserId],
      createdBy: currentUserId
    });

    await chat.save();

    // Populate participants and creator for response
    await chat.populate('participants', 'username email nativeLanguage');
    await chat.populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: chat
    });

  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all chats for a user
 */
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Verify user can access this data
    if (userId !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'username email nativeLanguage')
      .populate('createdBy', 'username email')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: chats
    });

  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get a specific chat
 */
const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const currentUserId = req.user._id;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'username email nativeLanguage')
      .populate('createdBy', 'username email');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(
      participant => participant._id.toString() === currentUserId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - not a participant'
      });
    }

    res.json({
      success: true,
      data: chat
    });

  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a chat
 */
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const currentUserId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if current user is a participant
    const isParticipant = chat.participants.includes(currentUserId);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - not a participant'
      });
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chat: chatId });

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.json({
      success: true,
      message: 'Chat deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createChat,
  getUserChats,
  getChat,
  deleteChat
};
