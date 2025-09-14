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
  // Legacy fields for backward compatibility
  originalText: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  translations: {
    type: Map,
    of: String
  },
  // New encryption fields
  encryptedContent: {
    type: String,
    required: function() {
      return this.isEncrypted;
    }
  },
  isEncrypted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ chat: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
