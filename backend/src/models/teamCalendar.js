const mongoose = require('mongoose');

const teamCalendarSchema = new mongoose.Schema({
  team: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team',
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  events: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event' 
  }],
});


// Export the model
module.exports = mongoose.model('teamCalendar', teamCalendarSchema);;
