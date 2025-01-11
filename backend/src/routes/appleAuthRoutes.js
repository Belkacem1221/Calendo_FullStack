const express = require('express');
const router = express.Router();
const { getAppleAuthURL, handleAppleCallback } = require('../controllers/appleAuthController');

// Route to get Apple Auth URL
router.get('/auth-url', getAppleAuthURL);

// Route for Apple OAuth callback
router.get('/oauth2callback', handleAppleCallback);

module.exports = router;
