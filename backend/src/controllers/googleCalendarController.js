const { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = require('../services/googleCalendarService');

/**
 * Handle the request to fetch calendar events.
 */
exports.getCalendarEvents = async (req, res) => {
  try {
    const events = await getCalendarEvents(req.oauth2Client);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching calendar events', details: error.message });
  }
};

/**
 * Handle the request to create a new calendar event.
 */
exports.createCalendarEvent = async (req, res) => {
  const { summary, location, description, startTime, endTime, timeZone } = req.body;

  const eventData = {
    summary,
    location,
    description,
    start: {
      dateTime: startTime,
      timeZone: timeZone || 'UTC',
    },
    end: {
      dateTime: endTime,
      timeZone: timeZone || 'UTC',
    },
  };

  try {
    const createdEvent = await createCalendarEvent(req.oauth2Client, eventData);
    res.json(createdEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error creating calendar event', details: error.message });
  }
};

/**
 * Handle the request to update a calendar event.
 */
exports.updateCalendarEvent = async (req, res) => {
  const { eventId } = req.params;
  const { summary, location, description, startTime, endTime, timeZone } = req.body;

  const updatedEventData = {
    summary,
    location,
    description,
    start: {
      dateTime: startTime,
      timeZone: timeZone || 'UTC',
    },
    end: {
      dateTime: endTime,
      timeZone: timeZone || 'UTC',
    },
  };

  try {
    const updatedEvent = await updateCalendarEvent(req.oauth2Client, eventId, updatedEventData);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error updating calendar event', details: error.message });
  }
};

/**
 * Handle the request to delete a calendar event.
 */
exports.deleteCalendarEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    await deleteCalendarEvent(req.oauth2Client, eventId); // Using service function for deletion
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ error: 'Error deleting calendar event', details: error.message });
  }
};
