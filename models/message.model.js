const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  originalText: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  translations: {
    type: Map,
    of: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ chat: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
