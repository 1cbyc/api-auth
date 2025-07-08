const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const { generateTokens } = require('../utils/jwt');
const logger = require('../utils/logger');
const config = require('../config/config');

const userController = {
  // Register new user
  register: asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email.toLowerCase() 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      role: role || 'student'
    });

    // Generate tokens
    const tokens = generateTokens(user._id);

    // Update user with refresh token
    await User.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
      refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    logger.info('User registered successfully', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn
        }
      }
    });
  }),

  // Login user
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and check authentication
    const result = await User.getAuthenticated(email, password);

    if (result.error) {
      logger.warn('Login failed', {
        email,
        error: result.error,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(401).json({
        success: false,
        message: result.error
      });
    }

    const user = result;

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Generate tokens
    const tokens = generateTokens(user._id);

    // Update user with refresh token and last login
    await User.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
      refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      lastLogin: new Date()
    });

    logger.info('User logged in successfully', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn
        }
      }
    });
  }),

  // Get user profile
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  }),

  // Update user profile
  updateProfile: asyncHandler(async (req, res) => {
    const { username, email } = req.body;
    const updates = {};

    // Only allow updating username and email
    if (username) updates.username = username;
    if (email) updates.email = email.toLowerCase();

    // Check for conflicts if updating email or username
    if (email || username) {
      const conflictQuery = {};
      if (email) conflictQuery.email = email.toLowerCase();
      if (username) conflictQuery.username = username;
      conflictQuery._id = { $ne: req.user._id };

      const existingUser = await User.findOne(conflictQuery);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.email === email?.toLowerCase()
            ? 'Email already in use'
            : 'Username already taken'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    logger.info('Profile updated', {
      userId: req.user._id,
      updates,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  }),

  // Change password
  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info('Password changed', {
      userId: req.user._id,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  }),

  // Refresh token
  refreshToken: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    
    // Find user with this refresh token
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: refreshToken,
      refreshTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);

    // Update refresh token
    await User.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
      refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    logger.info('Token refreshed', {
      userId: user._id,
      ip: req.ip
    });

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      }
    });
  }),

  // Logout
  logout: asyncHandler(async (req, res) => {
    // Clear refresh token
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: 1, refreshTokenExpires: 1 }
    });

    logger.info('User logged out', {
      userId: req.user._id,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }),

  // Get all users (admin only)
  getAllUsers: asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  }),

  // Delete user (admin only)
  deleteUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info('User deleted', {
      deletedUserId: userId,
      deletedBy: req.user._id,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  })
};

module.exports = userController;
