const express = require('express');
const { mergeTeamCalendars } = require('../controllers/teamCalendarController');

const router = express.Router();

// Merge team calendars
router.get('/merge/:teamId', mergeTeamCalendars);

module.exports = router;
