const { google } = require('googleapis');

// Initialize the Google Calendar API client
const calendar = google.calendar('v3');

/**
 * Get the events of a user from their Google Calendar.
 * @param {Object} oauth2Client - The authenticated OAuth2 client.
 * @returns {Promise<Object>} - List of events.
 */
const getCalendarEvents = async (oauth2Client) => {
  try {
    const events = await calendar.events.list({
      auth: oauth2Client,
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(), // Only events after the current time
      maxResults: 10, // Get the first 10 events
      singleEvents: true, // Get events that repeat
      orderBy: 'startTime',
    });
    return events.data.items;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw new Error('Error fetching calendar events');
  }
};

/**
 * Create an event on the user's Google Calendar.
 * @param {Object} oauth2Client - The authenticated OAuth2 client.
 * @param {Object} eventData - Event data to be created.
 * @returns {Promise<Object>} - Created event details.
 */
const createCalendarEvent = async (oauth2Client, eventData) => {
  try {
    const event = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      resource: eventData,
    });
    return event.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Error creating calendar event');
  }
};

/**
 * Update an existing event on the user's Google Calendar.
 * @param {Object} oauth2Client - The authenticated OAuth2 client.
 * @param {String} eventId - The event ID to update.
 * @param {Object} updatedEventData - The data to update the event with.
 * @returns {Promise<Object>} - The updated event.
 */
const updateCalendarEvent = async (oauth2Client, eventId, updatedEventData) => {
  try {
    const updatedEvent = await calendar.events.update({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId,
      resource: updatedEventData,
    });
    return updatedEvent.data;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw new Error('Error updating calendar event');
  }
};

/**
 * Delete an event on the user's Google Calendar.
 * @param {Object} oauth2Client - The authenticated OAuth2 client.
 * @param {String} eventId - The event ID to delete.
 * @returns {Promise<Object>} - Response after deleting the event.
 */
const deleteCalendarEvent = async (oauth2Client, eventId) => {
  try {
    const response = await calendar.events.delete({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId,
    });
    return response.data; // Return the response after deletion
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw new Error('Error deleting calendar event');
  }
};

module.exports = { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent };
