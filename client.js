const axios = require('axios');
const crypto = require('crypto');

const secret = 'yourSecretKey'; // Use the same secret key as the server
const serverUrl = 'http://localhost:3000'; // Replace with your server URL

// Dummy system information
const systemInfo = {
  // Your system information here
  ip: '117.34.16.8'
};

let secretKey = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32);

// Encrypt system information using AES
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
let encryptedData = cipher.update(JSON.stringify(systemInfo), 'utf-8', 'hex');
encryptedData += cipher.final('hex');

// Send encrypted data to the server for authentication
axios.post(`${serverUrl}/authenticate`, { encryptedData, iv: iv.toString('hex') })
  .then(response => {
    console.log(response.data.message);
  })
  .catch(error => {
    console.error('Authentication failed:', error.message);
  });
