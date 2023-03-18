const crypto = require('crypto');

// Function to encrypt a password
function hashPassword(password, salt) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash;
}

// Function to generate a random salt
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

// Function to decrypt a password
function verifyPassword(password, salt, hash) {
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === testHash;
}

module.exports = { hashPassword, generateSalt, verifyPassword };
