const express = require('express');
const router = express.Router();  // Initialize the router
const UserController = require('../controllers/userControllers');
const { authenticateToken} = require('../middlewares/authMiddleware');
const authenticateAdmin = require('../middlewares/authenticateAdmin');

//Admin routes
router.get('/', authenticateToken, authenticateAdmin, UserController.getAllUsers); // Admin can access all users
router.delete('/:id', authenticateToken, authenticateAdmin, UserController.deleteUser); // Admin can delete user
router.patch('/:id/role', authenticateToken, authenticateAdmin, UserController.changeUserRole); // Admin can change user role


// Protected routes
router.get('/:id', authenticateToken, UserController.getUserById); // Get user by ID
router.put('/:id', authenticateToken, UserController.updateUser); // Update user
router.patch('/:id/password', authenticateToken, UserController.updatePassword); // Update password
router.get('/:id/teams',authenticateToken, UserController.getUserTeams); //get user teams

module.exports = router;