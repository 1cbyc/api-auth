# API Authentication System

Under the hood:
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **Error Handling**: express-async-handler

## Dependencies

- `express`: Web framework for Node.js
- `mongoose`: MongoDB object modeling tool
- `bcryptjs`: Password hashing library
- `jsonwebtoken`: JWT implementation
- `express-async-handler`: Async error handling
- `dotenv`: Environment variable management

## Database Schema

### User Model
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["admin", "instructor", "student"], default: "student"),
  lastLogin: Date,
  timestamps: true
}
```

## Authentication Flow

### 1. User Registration
- **Endpoint**: `POST /api/users/register`
- **Body**: `{ username, email, password, role }`
- **Process**:
  - Validates required fields
  - Checks for existing user by email
  - Hashes password using bcrypt
  - Creates new user in database
  - Returns user data (excluding password)

### 2. User Login
- **Endpoint**: `POST /api/users/login`
- **Body**: `{ email, password }`
- **Process**:
  - Validates credentials
  - Compares password hash
  - Generates JWT token (30-day expiry)
  - Returns token and user data

### 3. Profile Access
- **Endpoint**: `GET /api/users/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Process**:
  - Validates JWT token
  - Retrieves user profile (excluding password)
  - Returns user data

## API Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|------------------------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | User login | No |
| GET | `/api/users/profile` | Get user profile | Yes |

## Security Features

- **Password Hashing**
- **JWT Authentication**
- **Role-Based Access**
- **Input Validation**
- **Error Handling**


## What to do

1. **Clone this repository**

2. **Install the dependencies**
   ```bash
   npm install
   ```

3. **Configure the env**
   - Create `.env` file with MongoDB credentials
   - Set `PASSWORD` and `USERNAME` variables

4. **Start the server**
   ```bash
   node app.js
   ```

The server will start on port 8000.

## Use on Postman

### Register a new user
```bash
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Get profile (with token)
```bash
curl -X GET http://localhost:8000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
