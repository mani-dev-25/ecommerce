const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
// Retrieve encryption key from env
const KEY_HEX = process.env.ENCRYPTION_KEY;
if (!KEY_HEX) throw new Error("FATAL ERROR: ENCRYPTION_KEY is not defined.");
const KEY = Buffer.from(KEY_HEX, 'hex');

/**
 * Encrypts cleartext using AES-256-GCM
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted string in format `iv:authTag:ciphertext`
 */
function encrypt(text) {
  if (!text) return '';
  try {
    const iv = crypto.randomBytes(12); // Standard 12-byte IV for GCM
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex'); // 16-byte auth tag
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error('Encryption utility error:', err);
    throw err;
  }
}

/**
 * Decrypts a ciphertext string formatted as `iv:authTag:ciphertext`
 * @param {string} encryptedText - Encrypted string
 * @returns {string} Decrypted plain text
 */
function decrypt(encryptedText) {
  if (!encryptedText) return '';
  try {
    const parts = encryptedText.split(':');
    // If format doesn't match iv:authTag:ciphertext, it is likely unencrypted/legacy data
    if (parts.length !== 3) {
      return encryptedText;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const ciphertext = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    console.error('Decryption utility error (possible bad key or corrupted data):', err.message);
    return '[Decryption Error]';
  }
}

module.exports = {
  encrypt,
  decrypt
};
