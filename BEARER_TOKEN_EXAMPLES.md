# Bearer Token Authentication Examples

## Overview

Your API now uses JWT (JSON Web Tokens) for authentication. Users receive a bearer token when they register or login, and must include this token in the Authorization header for protected endpoints.

## Authentication Flow

### 1. Register User (Get Token)
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
    "user": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "alice",
      "email": "alice@example.com",
      "nativeLanguage": "en",
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User (Get Token)
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
    "user": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "alice",
      "email": "alice@example.com",
      "nativeLanguage": "en"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Using Bearer Tokens

### Authorization Header Format
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### 3. Create Chat (Protected Route)
```bash
curl -X POST http://localhost:8080/api/chats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "participants": ["64f1a2b3c4d5e6f7g8h9i0j2"]
  }'
```

### 4. Send Message (Protected Route)
```bash
curl -X POST http://localhost:8080/api/chats/CHAT_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "originalText": "Hello Bob!"
  }'
```

### 5. Get User Profile (Protected Route)
```bash
curl http://localhost:8080/api/users/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 6. Get User Chats (Protected Route)
```bash
curl http://localhost:8080/api/users/64f1a2b3c4d5e6f7g8h9i0j1/chats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Frontend Integration

### JavaScript/TypeScript Examples

```javascript
// Store token after login/register
const token = response.data.token;
localStorage.setItem('authToken', token);

// Create authenticated request function
async function authenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('authToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return fetch(url, mergedOptions);
}

// Register user
async function registerUser(username, email, password, language) {
  const response = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, nativeLanguage: language })
  });
  
  const result = await response.json();
  if (result.success) {
    localStorage.setItem('authToken', result.data.token);
  }
  return result;
}

// Login user
async function loginUser(email, password) {
  const response = await fetch('http://localhost:8080/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  if (result.success) {
    localStorage.setItem('authToken', result.data.token);
  }
  return result;
}

// Send message (authenticated)
async function sendMessage(chatId, text) {
  const response = await authenticatedRequest(`http://localhost:8080/api/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ originalText: text })
  });
  
  return response.json();
}

// Create chat (authenticated)
async function createChat(participantIds) {
  const response = await authenticatedRequest('http://localhost:8080/api/chats', {
    method: 'POST',
    body: JSON.stringify({ participants: participantIds })
  });
  
  return response.json();
}
```

### React Hook Example

```jsx
import { useState, useEffect } from 'react';

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    if (result.success) {
      setToken(result.data.token);
      setUser(result.data.user);
      localStorage.setItem('authToken', result.data.token);
    }
    return result;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return { token, user, login, logout };
}

// Usage in component
function ChatComponent() {
  const { token, user, login, logout } = useAuth();
  
  if (!token) {
    return <LoginForm onLogin={login} />;
  }
  
  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <button onClick={logout}>Logout</button>
      {/* Chat interface */}
    </div>
  );
}
```

## Error Responses

### 401 Unauthorized - No Token
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 401 Unauthorized - Invalid Token
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 401 Unauthorized - Expired Token
```json
{
  "success": false,
  "message": "Token expired"
}
```

### 401 Unauthorized - User Not Found
```json
{
  "success": false,
  "message": "Invalid token - user not found"
}
```

## Security Features

- **JWT Tokens**: Secure, stateless authentication
- **Token Expiration**: Tokens expire after 7 days
- **Password Hashing**: Passwords are hashed with bcrypt
- **Protected Routes**: All chat and message operations require authentication
- **User Context**: Authenticated user is automatically available in protected routes

## API Endpoints Summary

### Public Routes (No Authentication)
- `POST /api/users` - Register user
- `POST /api/users/login` - Login user

### Protected Routes (Bearer Token Required)
- `GET /api/users/:userId` - Get user profile
- `POST /api/chats` - Create chat
- `GET /api/users/:userId/chats` - Get user's chats
- `POST /api/chats/:chatId/messages` - Send message
- `GET /api/chats/:chatId/messages` - Get messages

## Environment Variables

Make sure your `.env` file includes:
```env
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

**Important**: Change the JWT_SECRET to a strong, random string in production!
