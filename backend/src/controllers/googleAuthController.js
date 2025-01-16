const dotenv = require('dotenv');
dotenv.config();
const { google } = require('googleapis');


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );


// Generate Google Auth URL
exports.getGoogleAuthURL = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });
  res.json({ authUrl });
};

// Handle Google OAuth Callback
exports.handleGoogleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.json({ tokens });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving tokens', details: error });
  }
};
