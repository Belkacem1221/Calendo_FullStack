const authenticateAdmin = (req, res, next) => {
  try {
    console.log('User info:', req.user); // Debugging line

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying admin access.', error });
  }
};

module.exports = authenticateAdmin;