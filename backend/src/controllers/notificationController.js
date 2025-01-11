const Notification = require('../models/Notification');
const User = require('../models/User');

// Create a new notification
exports.createNotification = async (req, res) => {
  const { message, userId, eventId } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the notification
    const notification = new Notification({
      message,
      userId,
      eventId,
    });

    // Save the notification to the database
    await notification.save();

    res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

// Get all notifications for a specific user
exports.getUserNotifications = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Fetch notifications for the given userId
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 }) // Sort by most recent
        .exec();
  
      res.status(200).json({
        notifications,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications', error });
    }
  };
  