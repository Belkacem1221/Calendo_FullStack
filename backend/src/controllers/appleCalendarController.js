const { 
    getAppleCalendarEvents, 
    createAppleCalendarEvent, 
    updateAppleCalendarEvent, 
    deleteAppleCalendarEvent 
  } = require('../services/appleCalendarService');
  
  /**
   * Controller to fetch Apple Calendar events
   */
  exports.getAppleCalendarEvents = async (req, res) => {
    try {
      const accessToken = req.oauth2Client.access_token; // Use OAuth2 token from the request
      const events = await getAppleCalendarEvents(accessToken);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching Apple Calendar events', details: error.message });
    }
  };
  
  /**
   * Controller to create a new Apple Calendar event
   */
  exports.createAppleCalendarEvent = async (req, res) => {
    const { summary, location, description, startTime, endTime, timeZone } = req.body;
    const eventData = {
      summary,
      location,
      description,
      startTime,
      endTime,
      timeZone: timeZone || 'UTC',
    };
  
    try {
      const accessToken = req.oauth2Client.access_token;
      const createdEvent = await createAppleCalendarEvent(accessToken, eventData);
      res.json(createdEvent);
    } catch (error) {
      res.status(500).json({ error: 'Error creating Apple Calendar event', details: error.message });
    }
  };
  
  /**
   * Controller to update an Apple Calendar event
   */
  exports.updateAppleCalendarEvent = async (req, res) => {
    const { eventId } = req.params;
    const { summary, location, description, startTime, endTime, timeZone } = req.body;
  
    const updatedEventData = {
      summary,
      location,
      description,
      startTime,
      endTime,
      timeZone: timeZone || 'UTC',
    };
  
    try {
      const accessToken = req.oauth2Client.access_token;
      const updatedEvent = await updateAppleCalendarEvent(accessToken, eventId, updatedEventData);
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ error: 'Error updating Apple Calendar event', details: error.message });
    }
  };
  
  /**
   * Controller to delete an Apple Calendar event
   */
  exports.deleteAppleCalendarEvent = async (req, res) => {
    const { eventId } = req.params;
  
    try {
      const accessToken = req.oauth2Client.access_token;
      await deleteAppleCalendarEvent(accessToken, eventId);
      res.status(200).json({ message: 'Apple Calendar event deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting Apple Calendar event', details: error.message });
    }
  };
  