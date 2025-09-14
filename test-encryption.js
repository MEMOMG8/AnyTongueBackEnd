const crypto = require('crypto');

// Generate a proper 32-byte (64 hex character) encryption key
function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Test encryption/decryption
function testEncryption() {
  try {
    const { encryptObject, decryptObject } = require('./services/encryption.service');
    
    const testData = {
      originalText: "Hello World!",
      translations: {
        es: "¡Hola Mundo!",
        fr: "Bonjour le monde!"
      }
    };
    
    console.log('Testing encryption...');
    console.log('Original data:', testData);
    
    const encrypted = encryptObject(testData);
    console.log('Encrypted:', encrypted);
    
    const decrypted = decryptObject(encrypted);
    console.log('Decrypted:', decrypted);
    
    const isMatch = JSON.stringify(testData) === JSON.stringify(decrypted);
    console.log('Test result:', isMatch ? '✅ PASSED' : '❌ FAILED');
    
  } catch (error) {
    console.error('❌ Encryption test failed:', error.message);
    console.log('\n🔧 To fix this:');
    console.log('1. Set ENCRYPTION_KEY in your .env file');
    console.log('2. Use this command to generate a key:');
    console.log('   node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  }
}

// Generate a new encryption key
console.log('🔑 Generated encryption key:');
console.log(generateEncryptionKey());
console.log('\n📝 Add this to your .env file as:');
console.log('ENCRYPTION_KEY=your-generated-key-here');
console.log('\n🧪 Testing encryption...\n');

// Test the encryption
testEncryption();
