const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    options: [{
      option: {
        type: String, 
        required: true,
      },
      votes: {
        type: Number,
        default: 0,
      },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);