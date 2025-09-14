const crypto = require('crypto');

// Encryption configuration
const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits

// Get encryption key from environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Validate encryption key
if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

if (ENCRYPTION_KEY.length !== 64) { // 32 bytes = 64 hex characters
  throw new Error('ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)');
}

// Convert hex string to buffer
const ENCRYPTION_KEY_BUFFER = Buffer.from(ENCRYPTION_KEY, 'hex');

/**
 * Encrypt a text string
 * @param {string} text - The text to encrypt
 * @returns {string} - Base64 encoded encrypted data with IV
 */
function encryptText(text) {
  try {
    // Generate random IV for each encryption
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY_BUFFER, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Combine IV and encrypted data
    const combined = Buffer.concat([
      iv,
      Buffer.from(encrypted, 'base64')
    ]);
    
    return combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message');
  }
}

/**
 * Decrypt a base64 encoded encrypted string
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @returns {string} - Decrypted text
 */
function decryptText(encryptedData) {
  try {
    // Decode base64
    const combined = Buffer.from(encryptedData, 'base64');
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH);
    const encrypted = combined.slice(IV_LENGTH);
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY_BUFFER, iv);
    
    // Decrypt the data
    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message');
  }
}

/**
 * Encrypt an object (useful for message data)
 * @param {object} obj - Object to encrypt
 * @returns {string} - Base64 encoded encrypted data
 */
function encryptObject(obj) {
  const jsonString = JSON.stringify(obj);
  return encryptText(jsonString);
}

/**
 * Decrypt an object
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @returns {object} - Decrypted object
 */
function decryptObject(encryptedData) {
  const jsonString = decryptText(encryptedData);
  return JSON.parse(jsonString);
}

module.exports = {
  encryptText,
  decryptText,
  encryptObject,
  decryptObject
};