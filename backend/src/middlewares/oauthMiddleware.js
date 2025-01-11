const { google } = require('googleapis');
const { OAuth2 } = require('simple-oauth2');
const { google: googleConfig, apple: appleConfig } = require('../config/oauthConfig');

const oauthMiddleware = async (req, res, next) => {
  const { access_token, refresh_token, provider } = req.headers;

  if (!access_token || !refresh_token || !provider) {
    return res.status(400).json({ error: 'Authentication tokens or provider are missing' });
  }

  if (provider === 'google') {
    const oauth2Client = new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirectUri
    );

    oauth2Client.setCredentials({ access_token, refresh_token });

    try {
      await oauth2Client.getAccessToken();
      req.oauth2Client = oauth2Client;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Google authentication failed', details: error.message });
    }
  } else if (provider === 'apple') {
    const oauth2 = OAuth2.create({
      client: {
        id: appleConfig.clientId,
        secret: appleConfig.clientSecret,
      },
      auth: {
        tokenHost: 'https://appleid.apple.com',
        tokenPath: '/auth/token',
      },
    });

    try {
      const token = await oauth2.accessToken.create({ access_token, refresh_token });
      req.oauth2Client = token;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Apple authentication failed', details: error.message });
    }
  } else {
    return res.status(400).json({ error: 'Invalid provider' });
  }
};

module.exports = oauthMiddleware;
