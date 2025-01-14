const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const googleAuthRoutes = require('./src/routes/googleAuthRoutes');
const googleCalendarRoutes = require('./src/routes/googleCalendarRoutes');
const appleCalendarRoutes = require('./src/routes/appleCalendarRoutes');
const teamCalendarRoutes = require('./src/routes/teamCalendarRoutes'); // Team calendar routes
dotenv.config(); // Load environment variables

// Create an Express app
const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production' ? ['https://calendo-full-qs0us5k1e-yanis-s-projects.vercel.app'] : ['http://localhost:3000']; 
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests

// Database connection (MongoDB Atlas)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'Calendodb' });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes); // Event routes for handling event creation and updates
app.use('/api/google', googleAuthRoutes); // Google OAuth routes
app.use('/api/google/calendar', googleCalendarRoutes);
app.use('/api/apple/calendar', appleCalendarRoutes);
app.use('/api/teamCalendar', teamCalendarRoutes); // Team calendar routes

// Test route for checking server status
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware for general errors
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).json({ message: 'Internal Server Error' });
});

// Set up server to listen on a specific port
const PORT = process.env.PORT || 3000;
console.log(`Using port: ${PORT}`);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
