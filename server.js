const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// load secrets from env file
require('dotenv').config()

const app = express();
const secret = process.env.aes_secret // Replace with a strong secret key
const jwtSecret = process.env.jwt_secret; // Replace with a strong JWT secret

app.use(bodyParser.json());

// Authentication endpoint
app.post('/authenticate', (req, res) => {
  const { encryptedData, iv } = req.body;

  console.log("Got encrpyted data from client - ", encryptedData)
  console.log("secret - ", secret)
  let secretKey = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32);

  try {
    // Decrypt the data using AES
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');
    console.log("Decrypted data - ", decryptedData)
  }
  catch (error) {
    console.error('Decryption failed: ', error.message);
    return res.status(500).json({ success: false, message: 'Decryption failed' });
  }

  // Validate user or system information here

  // Generate JWT token
  const token = jwt.sign({ userId: '123', /* additional claims */ }, jwtSecret, { expiresIn: '1h' });

  

  // Send the token as a response
  res.json({ success: true, token });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
