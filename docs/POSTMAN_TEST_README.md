# Postman API Testing

I had to get ChatGPT to help me write this Postman testing doc, so anybody that sees this repo can use it faster.


1. **Import into Postman**: You can create a new collection and add these requests manually
2. **Environment Variables**: Create a Postman environment with these variables:
   - `baseUrl`: `http://localhost:8000`
   - `accessToken`: (will be set after login)
   - `refreshToken`: (will be set after login)

## Test Endpoints

### 1. Health Check
**GET** `{{baseUrl}}/health`

**Description**: Check if the server is running
**Authentication**: Not required

**Expected Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

### 2. Register User
**POST** `{{baseUrl}}/api/auth/register`

**Description**: Create a new user account
**Authentication**: Not required

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "SecurePass123!",
  "role": "student"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "testuser",
      "email": "test@example.com",
      "role": "student",
      "isEmailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "30d"
    }
  }
}
```

**Postman Setup**:
1. Set request type to `POST`
2. Go to `Body` tab
3. Select `raw`
4. Choose `JSON` from dropdown
5. Paste the JSON body above

---

### 3. Login User
**POST** `{{baseUrl}}/api/auth/login`

**Description**: Authenticate user and get tokens
**Authentication**: Not required

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "testuser",
      "email": "test@example.com",
      "role": "student",
      "isEmailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "30d"
    }
  }
}
```

**Postman Setup**:
1. Set request type to `POST`
2. Go to `Body` tab
3. Select `raw`
4. Choose `JSON` from dropdown
5. Paste the JSON body above

**After Login**: Copy the `accessToken` and `refreshToken` from the response and set them as environment variables.

---

### 4. Get Profile
**GET** `{{baseUrl}}/api/auth/profile`

**Description**: Get current user's profile
**Authentication**: Required

**Headers**:
```
Authorization: Bearer {{accessToken}}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "testuser",
      "email": "test@example.com",
      "role": "student",
      "isActive": true,
      "isEmailVerified": false,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Postman Setup**:
1. Set request type to `GET`
2. Go to `Headers` tab
3. Add `Authorization` header with value `Bearer {{accessToken}}`

---

### 5. Update Profile
**PUT** `{{baseUrl}}/api/auth/profile`

**Description**: Update user profile information
**Authentication**: Required

**Headers**:
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "newusername",
      "email": "newemail@example.com",
      "role": "student",
      "isActive": true,
      "isEmailVerified": false,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

**Postman Setup**:
1. Set request type to `PUT`
2. Go to `Headers` tab
3. Add `Authorization` header with value `Bearer {{accessToken}}`
4. Add `Content-Type` header with value `application/json`
5. Go to `Body` tab
6. Select `raw`
7. Choose `JSON` from dropdown
8. Paste the JSON body above

---

### 6. Change Password
**PUT** `{{baseUrl}}/api/auth/change-password`

**Description**: Change user password
**Authentication**: Required

**Headers**:
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Postman Setup**:
1. Set request type to `PUT`
2. Go to `Headers` tab
3. Add `Authorization` header with value `Bearer {{accessToken}}`
4. Add `Content-Type` header with value `application/json`
5. Go to `Body` tab
6. Select `raw`
7. Choose `JSON` from dropdown
8. Paste the JSON body above

---

### 7. Refresh Token
**POST** `{{baseUrl}}/api/auth/refresh-token`

**Description**: Get new access token using refresh token
**Authentication**: Not required

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "30d"
  }
}
```

**Postman Setup**:
1. Set request type to `POST`
2. Go to `Headers` tab
3. Add `Content-Type` header with value `application/json`
4. Go to `Body` tab
5. Select `raw`
6. Choose `JSON` from dropdown
7. Paste the JSON body above

---

### 8. Logout
**POST** `{{baseUrl}}/api/auth/logout`

**Description**: Logout user and invalidate refresh token
**Authentication**: Required

**Headers**:
```
Authorization: Bearer {{accessToken}}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Postman Setup**:
1. Set request type to `POST`
2. Go to `Headers` tab
3. Add `Authorization` header with value `Bearer {{accessToken}}`

---

### 9. Get All Users (Admin Only)
**GET** `{{baseUrl}}/api/users`

**Description**: Get paginated list of all users
**Authentication**: Required
**Authorization**: Admin role required

**Headers**:
```
Authorization: Bearer {{adminAccessToken}}
```

**Query Parameters** (optional):
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "username": "testuser",
        "email": "test@example.com",
        "role": "student",
        "isActive": true,
        "lastLogin": "2024-01-15T10:30:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

**Postman Setup**:
1. Set request type to `GET`
2. Go to `Headers` tab
3. Add `Authorization` header with value `Bearer {{adminAccessToken}}`
4. (Optional) Add query parameters in the URL: `?page=1&limit=10`

---

### 10. Delete User (Admin Only)
**DELETE** `{{baseUrl}}/api/users/{{userId}}`

**Description**: Delete a user account
**Authentication**: Required
**Authorization**: Admin role required

**Headers**:
```
Authorization: Bearer {{adminAccessToken}}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Postman Setup**:
1. Set request type to `DELETE`
2. Go to `Headers` tab
3. Add `Authorization` header with value `Bearer {{adminAccessToken}}`
4. Replace `{{userId}}` in the URL with the actual user ID

---

## Testing Flow

### Basic User Flow:
1. **Register** → Get tokens
2. **Login** → Get tokens (if already registered)
3. **Get Profile** → Verify user data
4. **Update Profile** → Change username/email
5. **Change Password** → Update password
6. **Logout** → Invalidate tokens

### Admin Flow:
1. **Login as Admin** → Get admin tokens
2. **Get All Users** → List all users
3. **Delete User** → Remove a user

### Token Management:
1. **Login** → Get access and refresh tokens
2. **Use Access Token** → For protected endpoints
3. **Refresh Token** → Get new access token when expired
4. **Logout** → Invalidate tokens

---

## Error Testing

### Test Invalid Login:
**POST** `{{baseUrl}}/api/auth/login`
```json
{
  "email": "wrong@email.com",
  "password": "wrongpassword"
}
```

### Test Invalid Token:
**GET** `{{baseUrl}}/api/auth/profile`
```
Authorization: Bearer invalid-token
```

### Test Rate Limiting:
Make 6 rapid requests to `/api/auth/login` to trigger rate limiting.

### Test Validation Errors:
Try registering with invalid data:
```json
{
  "username": "a",
  "email": "invalid-email",
  "password": "weak",
  "role": "invalid-role"
}
```

---

## Environment Variables Setup

1. Create a new environment in Postman
2. Add these variables:
   - `baseUrl`: `http://localhost:8000`
   - `accessToken`: (set after login)
   - `refreshToken`: (set after login)
   - `adminAccessToken`: (set after admin login)
   - `userId`: (set when needed for delete operations)

3. After each login response, manually update the token variables or use Postman's automatic variable extraction.

---

## Tips

1. **Save Responses**: Use Postman's "Tests" tab to automatically extract tokens from responses
2. **Environment Switching**: Create separate environments for development, staging, and production
3. **Collection Variables**: Use collection variables for common values
4. **Pre-request Scripts**: Automate token refresh before requests
5. **Tests**: Add assertions to verify response status codes and data structure

---

## Common Issues

1. **401 Unauthorized**: Check if access token is valid and properly formatted
2. **403 Forbidden**: Verify user has required role (admin for admin endpoints)
3. **400 Bad Request**: Check request body format and validation
4. **429 Too Many Requests**: Wait before making more requests (rate limiting)
5. **500 Server Error**: Check server logs for detailed error information 