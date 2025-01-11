const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
    }
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }


    // Create new user 
    const newUser = new User({ name, email, password: password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    console.log('Stored password hash:', user.password); // Log stored hash for debugging
    console.log('Entered password:', password); // Log entered password for debugging

    // Compare entered password with stored hash
    const isPasswordValid = await bcrypt.compare(password.trim(), user.password.trim());
    console.log('Password valid:', isPasswordValid); // Check comparison result

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token if valid
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token });
    
  } catch (error) {
    console.error('Error during login:', error); // Log any errors
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Logout user (client-side token removal)
exports.logoutUser = (req, res) => {
  // Token is removed client-side, no need to manage on the server-side
  res.json({ message: 'User logged out successfully' });
};
