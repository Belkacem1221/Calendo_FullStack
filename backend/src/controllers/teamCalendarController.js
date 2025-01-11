const Event = require('../models/Event');
const User = require('../models/User');
const moment = require('moment');
const TeamCalendar = require('../models/teamCalendar');


// Merge events from multiple team members into one calendar
exports.mergeTeamCalendars = async (req, res) => {
  const { teamId } = req.params;  // Team ID

  try {
    // Fetch all events for the team members
    const teamMembers = await User.find({ teamId });
    const teamEvents = await Event.find({ participants: { $in: teamMembers.map(member => member._id) } });

    // Merge all events into a single list
    const allEvents = [];
    teamEvents.forEach(event => {
      allEvents.push({
        startTime: moment(event.startTime),
        endTime: moment(event.endTime),
      });
    });

    // Sort the events by start time
    allEvents.sort((a, b) => a.startTime - b.startTime);

    // Merge events and calculate free/occupied time slots
    const mergedCalendar = [];
    let currentEnd = null;

    allEvents.forEach(event => {
      if (!currentEnd || event.startTime.isAfter(currentEnd)) {
        // Free slot
        if (currentEnd) {
          mergedCalendar.push({
            type: 'free',
            startTime: currentEnd.toISOString(),
            endTime: event.startTime.toISOString()
          });
        }
        // Occupied slot
        mergedCalendar.push({
          type: 'occupied',
          startTime: event.startTime.toISOString(),
          endTime: event.endTime.toISOString()
        });
        currentEnd = event.endTime;
      } else if (event.endTime.isAfter(currentEnd)) {
        currentEnd = event.endTime;
      }
    });

    // Save the merged calendar for the team
    const teamCalendar = await TeamCalendar.findOne({ teamId });
    if (teamCalendar) {
      teamCalendar.mergedCalendar = mergedCalendar;
      await teamCalendar.save();
    } else {
      await TeamCalendar.create({
        teamId,
        mergedCalendar
      });
    }

    res.status(200).json({ message: 'Team calendar merged successfully', mergedCalendar });
  } catch (error) {
    console.error('Error merging team calendars:', error);
    res.status(500).json({ message: 'Error merging team calendars' });
  }
};
