const jwt = require('jsonwebtoken');
const { apple: appleConfig } = require('../config/oauthConfig');

// Generate Apple Sign-in JWT
const generateAppleJWT = () => {
  const claims = {
    iss: appleConfig.teamId,
    aud: 'https://appleid.apple.com',
    sub: appleConfig.clientId,
  };

  return jwt.sign(claims, appleConfig.privateKey, {
    algorithm: 'ES256',
    expiresIn: '180d',
    header: {
      kid: appleConfig.keyId,
      alg: 'ES256',
    },
  });
};

// Generate Apple Auth URL
exports.getAppleAuthURL = (req, res) => {
  const authUrl = `https://appleid.apple.com/auth/authorize?client_id=${appleConfig.clientId}&redirect_uri=${encodeURIComponent(
    appleConfig.redirectUri
  )}&response_type=code&scope=email%20name`;

  res.json({ authUrl });
};

// Handle Apple OAuth Callback
exports.handleAppleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const fetch = (await import('node-fetch')).default; 
    const clientSecret = generateAppleJWT();

    const response = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: appleConfig.clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: appleConfig.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve tokens');
    }

    const tokens = await response.json();
    res.json({ tokens });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving tokens', details: error.message });
  }
};
