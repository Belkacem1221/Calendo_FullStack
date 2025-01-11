const express = require('express');
const { createEvent, getUserEvents, updateEvent, deleteEvent } = require('../controllers/eventController');
const authenticateToken = require('../middlewares/authMiddleware.js');

const router = express.Router();

// Create a new event (authenticated user)
router.post('/create', authenticateToken, createEvent);

// Get all events for a user
router.get('/:userId', authenticateToken, getUserEvents);

// Update an event
router.put('/:eventId', authenticateToken, updateEvent);

// Delete an event
router.delete('/:eventId', authenticateToken, deleteEvent);

module.exports = router;
