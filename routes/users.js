const express = require('express');
const rateLimit = require('express-rate-limit');
const userController = require('../controller/user');
const { isAuthenticated, authorize } = require('../middlewares/isAuth');
const { 
  registerValidation, 
  loginValidation, 
  passwordChangeValidation,
  profileUpdateValidation,
  handleValidationErrors 
} = require('../middlewares/validation/userValidation');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/api/auth/register', 
  authLimiter,
  registerValidation, 
  handleValidationErrors, 
  userController.register
);

router.post('/api/auth/login', 
  authLimiter,
  loginValidation, 
  handleValidationErrors, 
  userController.login
);

router.post('/api/auth/refresh-token', 
  userController.refreshToken
);

// Protected routes
router.get('/api/auth/profile', 
  isAuthenticated, 
  userController.profile
);

router.put('/api/auth/profile', 
  isAuthenticated,
  profileUpdateValidation,
  handleValidationErrors,
  userController.updateProfile
);

router.put('/api/auth/change-password', 
  isAuthenticated,
  passwordChangeValidation,
  handleValidationErrors,
  userController.changePassword
);

router.post('/api/auth/logout', 
  isAuthenticated, 
  userController.logout
);

// Admin only routes
router.get('/api/users', 
  isAuthenticated, 
  authorize('admin'), 
  userController.getAllUsers
);

router.delete('/api/users/:userId', 
  isAuthenticated, 
  authorize('admin'), 
  userController.deleteUser
);

module.exports = router;
