const bcrypt = require('bcryptjs');
const User = require('../models/User');

const Team = require('../models/Team');

// Function to get all teams that a user is part of
exports.getUserTeams = async (req, res) => {
  try {
    const { id } = req.params;

    // Find teams where the user is part of the 'members' array
    const teams = await Team.find({ 'members.user': id })
      .populate('admin', 'name email')  // Populate the admin field to show admin info
      .populate('members.user', 'name email');  // Populate the members field to show user details

    if (teams.length === 0) {
      return res.status(404).json({ message: 'No teams found for this user' });
    }

    return res.status(200).json({ message: 'Teams fetched successfully', teams });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
};
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If password is provided, hash it
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password', error: err });
  }
};

// Change user role (admin only)
exports.changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update role if provided
    user.role = role || user.role;
    await user.save();
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating role', error: err });
  }
};
