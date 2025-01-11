const express = require('express');
const router = express.Router();
const { getGoogleAuthURL, handleGoogleCallback } = require('../controllers/googleAuthController');

// Route to get Google Auth URL
router.get('/auth-url', getGoogleAuthURL);

// Route for Google OAuth callback
router.get('/oauth2callback', handleGoogleCallback);

module.exports = router;
