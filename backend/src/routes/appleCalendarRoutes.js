const express = require('express');
const { 
  getAppleCalendarEvents, 
  createAppleCalendarEvent, 
  updateAppleCalendarEvent, 
  deleteAppleCalendarEvent 
} = require('../controllers/appleCalendarController');
const oauthMiddleware = require('../middlewares/oauthMiddleware');
const router = express.Router();

// Route to get Apple Calendar events
router.get('/events', oauthMiddleware, getAppleCalendarEvents);

// Route to create a new Apple Calendar event
router.post('/create-event', oauthMiddleware, createAppleCalendarEvent);

// Route to update an Apple Calendar event
router.put('/update-event/:eventId', oauthMiddleware, updateAppleCalendarEvent);

// Route to delete an Apple Calendar event
router.delete('/delete-event/:eventId', oauthMiddleware, deleteAppleCalendarEvent);

module.exports = router;
