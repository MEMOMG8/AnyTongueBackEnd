# User Management Examples

## Updated User Schema

The user now includes:
- **username** (string, unique, 3-30 chars)
- **email** (string, unique, valid email format)
- **password** (string, min 6 chars, automatically hashed)
- **nativeLanguage** (string, default: 'en')

## API Endpoints

### 1. Create User
**POST** `/api/users`

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123",
    "nativeLanguage": "en"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "username": "alice",
    "email": "alice@example.com",
    "nativeLanguage": "en",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 2. User Login
**POST** `/api/users/login`

```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "username": "alice",
    "email": "alice@example.com",
    "nativeLanguage": "en",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 3. Get User Profile
**GET** `/api/users/:userId`

```bash
curl http://localhost:8080/api/users/64f1a2b3c4d5e6f7g8h9i0j1
```

## Complete Chat Flow Example

### Step 1: Create Users
```bash
# Create Alice (English speaker)
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123",
    "nativeLanguage": "en"
  }'

# Create Bob (Spanish speaker)
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bob",
    "email": "bob@example.com",
    "password": "password123",
    "nativeLanguage": "es"
  }'
```

### Step 2: Create Chat
```bash
curl -X POST http://localhost:8080/api/chats \
  -H "Content-Type: application/json" \
  -d '{
    "participants": ["USER_ID_1", "USER_ID_2"]
  }'
```

### Step 3: Send Message
```bash
curl -X POST http://localhost:8080/api/chats/CHAT_ID/messages \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "USER_ID_1",
    "originalText": "Hello Bob! How are you?"
  }'
```

## Security Features

- **Password Hashing**: Passwords are automatically hashed with bcrypt
- **Email Validation**: Email format is validated
- **Unique Constraints**: Username and email must be unique
- **Password Removal**: Passwords are never returned in API responses
- **Input Validation**: All fields are validated before saving

## Frontend Integration

```javascript
// Register a new user
async function registerUser(username, email, password, language) {
  const response = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password,
      nativeLanguage: language
    })
  });
  return response.json();
}

// Login user
async function loginUser(email, password) {
  const response = await fetch('http://localhost:8080/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

// Get user profile
async function getUserProfile(userId) {
  const response = await fetch(`http://localhost:8080/api/users/${userId}`);
  return response.json();
}
```

## Error Handling

### Common Error Responses

**400 Bad Request - Missing Fields:**
```json
{
  "success": false,
  "message": "Username, email, and password are required"
}
```

**400 Bad Request - Duplicate User:**
```json
{
  "success": false,
  "message": "username already exists"
}
```

**401 Unauthorized - Invalid Login:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**404 Not Found - User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```
