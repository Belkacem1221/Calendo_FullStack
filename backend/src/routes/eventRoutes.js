const express = require('express');
const { createEvent, getUserEvents, updateEvent, deleteEvent, addVoteToEvent, getVotesForEvent } = require('../controllers/eventController');
const { authenticateToken} = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new event (authenticated user)
router.post('/create', authenticateToken, createEvent);

// Get all events for a user
router.get('/:userId', authenticateToken, getUserEvents);

// Update an event
router.put('/:eventId', authenticateToken, updateEvent);

// Delete an event
router.delete('/:eventId', authenticateToken, deleteEvent);

// Add a vote to an event
router.post('/:eventId/vote', authenticateToken, addVoteToEvent);

// Get current votes for an event
router.get('/:eventId/votes', authenticateToken, getVotesForEvent);

module.exports = router;