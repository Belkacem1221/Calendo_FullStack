/**
 * Fetch events from Apple Calendar APII
 */
const getAppleCalendarEvents = async (accessToken) => {
    const fetch = (await import('node-fetch')).default; // Dynamic import
    const response = await fetch('https://api.apple.com/calendar/v1/events', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    const data = await response.json();
    return data;
  };
  
  /**
   * Create an event on Apple Calendar
   */
  const createAppleCalendarEvent = async (accessToken, eventData) => {
    const fetch = (await import('node-fetch')).default; // Dynamic import
    const response = await fetch('https://api.apple.com/calendar/v1/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: eventData.summary,
        location: eventData.location,
        description: eventData.description,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        timeZone: eventData.timeZone,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    const data = await response.json();
    return data;
  };
  
  /**
   * Update an event on Apple Calendar
   */
  const updateAppleCalendarEvent = async (accessToken, eventId, updatedEventData) => {
    const fetch = (await import('node-fetch')).default; // Dynamic import
    const response = await fetch(`https://api.apple.com/calendar/v1/events/${eventId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: updatedEventData.summary,
        location: updatedEventData.location,
        description: updatedEventData.description,
        startTime: updatedEventData.startTime,
        endTime: updatedEventData.endTime,
        timeZone: updatedEventData.timeZone,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    const data = await response.json();
    return data;
  };
  
  /**
   * Delete an event from Apple Calendar
   */
  const deleteAppleCalendarEvent = async (accessToken, eventId) => {
    const fetch = (await import('node-fetch')).default; // Dynamic import
    const response = await fetch(`https://api.apple.com/calendar/v1/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  };
  
  module.exports = {
    getAppleCalendarEvents,
    createAppleCalendarEvent,
    updateAppleCalendarEvent,
    deleteAppleCalendarEvent,
  };
  