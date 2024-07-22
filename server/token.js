// generateJwtTokenKey.js

const crypto = require('crypto');

// Generate a random 256-bit (32-byte) key
const jwtTokenKey = crypto.randomBytes(32).toString('hex');

console.log(jwtTokenKey);
