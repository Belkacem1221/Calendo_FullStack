const jwt = require('jsonwebtoken');
const Team = require('../models/Team');

exports.authenticateToken = (req, res, next) => {
  // Get token from the request headers
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify token with secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

exports.rbacMiddleware = (teamId, requiredRole) => async (req, res, next) => {
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const member = team.members.find(m => m.user.toString() === req.user.id);
    if (!member) {
      return res.status(403).json({ message: 'User is not a member of this team' });
    }

    const userRole = member.role;
    const rolesHierarchy = ['member', 'moderator', 'admin'];

    if (rolesHierarchy.indexOf(userRole) < rolesHierarchy.indexOf(requiredRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Error checking user role', error: err });
  }
};