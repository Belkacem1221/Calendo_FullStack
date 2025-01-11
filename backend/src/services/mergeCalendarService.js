const cron = require('node-cron');
const TeamCalendar = require('../models/teamCalendar');
const Event = require('../models/Event');

// Cron job to merge the team calendar every hour (or any other interval)
cron.schedule('0 * * * *', async () => {
  try {
    const teamCalendars = await TeamCalendar.find();
    teamCalendars.forEach(async (teamCalendar) => {
      const events = await Event.find({ _id: { $in: teamCalendar.events } });

      // Merge events to calculate free/occupied slots
      const mergedCalendar = mergeTeamCalendars(events);
      
      // Update the team calendar with the merged data
      teamCalendar.mergedCalendar = mergedCalendar;
      await teamCalendar.save();
    });
    console.log('Team calendars merged successfully');
  } catch (error) {
    console.error('Error merging team calendars:', error);
  }
});
