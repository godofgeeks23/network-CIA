const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const secret = 'yourSecretKey'; // Replace with a strong secret key

app.use(bodyParser.json());

// Authentication endpoint
app.post('/authenticate', (req, res) => {
  const { encryptedData, iv } = req.body;

  let secretKey = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32);

  // Decrypt the data using AES
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');

  // Validate user or system information here

  // Send response
  res.json({ success: true, message: 'Authentication successful' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
