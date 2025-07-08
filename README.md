# auth api

i wrote this as my node.js authentication API that provides basic user authentication functionality with some features i need every time:
- User Registration - Create accounts with username, email, password, and role
- User Login - Authenticate users and generate JWT tokens
- Profile Access - Protected endpoint to get user information
- Role-Based System - Supports admin, instructor, and student roles
- Password Security - Uses bcrypt for password hashing
- JWT Authentication - Token-based stateless authentication


Although, I intend to add:
Password reset functionality
Email verification
Refresh tokens
User management endpoints
Role-based authorization middleware


And then fix:
Inconsistent error handling patterns
The hardcoded values (port, database URL from earlier, so i can ust reuse this every time)
THe lack of logging system
Missing validation
The lack of environment configuration