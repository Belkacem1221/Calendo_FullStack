const express = require('express');
const { createNotification, getUserNotifications } = require('../controllers/notificationController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a notification (admin or authorized user can trigger this)
router.post('/create', authenticateToken, createNotification);

// Get all notifications for a user
router.get('/:userId', authenticateToken, getUserNotifications);

module.exports = router;