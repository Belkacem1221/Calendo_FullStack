const express = require('express');
const { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = require('../controllers/googleCalendarController');
const oauthMiddleware = require('../middlewares/oauthMiddleware');
const router = express.Router();

// Route to get calendar events
router.get('/events', oauthMiddleware, getCalendarEvents);

// Route to create a calendar event
router.post('/create-event', oauthMiddleware, createCalendarEvent);

// Route to update a calendar event
router.put('/update-event/:eventId', oauthMiddleware, updateCalendarEvent);

router.delete('/delete-event/:eventId', oauthMiddleware, deleteCalendarEvent);

module.exports = router;
