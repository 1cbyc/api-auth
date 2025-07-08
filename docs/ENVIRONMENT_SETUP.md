# Environment Setup

Create a `.env` file in the root directory with the following variables:

## Required Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=8000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/auth-api

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRE=7d

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (for future features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging Configuration
LOG_LEVEL=info
```

## Important Security Notes

1. **JWT Secrets**: Never use the default secrets in production. Generate strong, unique secrets.
2. **Database URI**: Use a secure MongoDB connection string in production.
3. **Environment**: Set NODE_ENV to 'production' in production environments.
4. **CORS**: Configure CORS_ORIGIN to match your frontend domain in production.

## Generating Secure Secrets

You can generate secure secrets using Node.js:

```javascript
require('crypto').randomBytes(64).toString('hex')
```

## Production Checklist

- [ ] Change all default secrets
- [ ] Set NODE_ENV to 'production'
- [ ] Configure secure MongoDB connection
- [ ] Set appropriate CORS origins
- [ ] Configure email settings (if using email features)
- [ ] Set up proper logging
- [ ] Configure rate limiting appropriately 