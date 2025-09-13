# Complete API Usage Guide

## 🚀 **Quick Start**

Your AnyTongue backend is running on `http://localhost:8080` with the following endpoints:

## 📋 **All Available Endpoints**

### **Public Endpoints (No Authentication)**
- `POST /api/users` - Register new user
- `POST /api/users/login` - Login user

### **Protected Endpoints (Bearer Token Required)**
- `GET /api/users/:userId` - Get user profile
- `POST /api/chats` - Create chat with another user
- `GET /api/chats/user/:userId` - Get user's chats
- `GET /api/chats/:chatId` - Get specific chat
- `DELETE /api/chats/:chatId` - Delete chat
- `POST /api/chats/:chatId/messages` - Send message
- `GET /api/chats/:chatId/messages` - Get messages

---

## 🔐 **Step 1: Authentication**

### **Register a New User**
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

### **Login User**
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

**Save the token for all subsequent requests!**

---

## 👥 **Step 2: Create Users for Testing**

### **Create Alice (English)**
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

### **Create Bob (Spanish)**
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bob",
    "email": "bob@example.com",
    "password": "password123",
    "nativeLanguage": "es"
  }'
```

**Note down the user IDs from the responses!**

---

## 💬 **Step 3: Create a Chat**

### **Alice creates a chat with Bob**
```bash
curl -X POST http://localhost:8080/api/chats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ALICE_TOKEN_HERE" \
  -d '{
    "otherUserId": "BOB_USER_ID_HERE"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Chat created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "participants": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "username": "alice",
        "email": "alice@example.com",
        "nativeLanguage": "en"
      },
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "username": "bob",
        "email": "bob@example.com",
        "nativeLanguage": "es"
      }
    ],
    "createdBy": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "alice",
      "email": "alice@example.com"
    },
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Note down the chat ID!**

---

## 📨 **Step 4: Send Messages**

### **Alice sends a message (will be translated to Spanish for Bob)**
```bash
curl -X POST http://localhost:8080/api/chats/CHAT_ID_HERE/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ALICE_TOKEN_HERE" \
  -d '{
    "originalText": "Hello Bob! How are you today?"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
    "sender": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "alice",
      "nativeLanguage": "en"
    },
    "chat": "64f1a2b3c4d5e6f7g8h9i0j4",
    "originalText": "Hello Bob! How are you today?",
    "translations": {
      "en": "Hello Bob! How are you today?",
      "es": "¡Hola Bob! ¿Cómo estás hoy?"
    },
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### **Bob sends a message (will be translated to English for Alice)**
```bash
curl -X POST http://localhost:8080/api/chats/CHAT_ID_HERE/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer BOB_TOKEN_HERE" \
  -d '{
    "originalText": "¡Hola Alice! Estoy muy bien, gracias. ¿Y tú?"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
    "sender": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "username": "bob",
      "nativeLanguage": "es"
    },
    "chat": "64f1a2b3c4d5e6f7g8h9i0j4",
    "originalText": "¡Hola Alice! Estoy muy bien, gracias. ¿Y tú?",
    "translations": {
      "en": "Hello Alice! I'm very well, thank you. And you?",
      "es": "¡Hola Alice! Estoy muy bien, gracias. ¿Y tú?"
    },
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

## 📋 **Step 5: Get Messages**

### **Get all messages in a chat**
```bash
curl http://localhost:8080/api/chats/CHAT_ID_HERE/messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
      "sender": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "username": "bob",
        "nativeLanguage": "es"
      },
      "originalText": "¡Hola Alice! Estoy muy bien, gracias. ¿Y tú?",
      "translations": {
        "en": "Hello Alice! I'm very well, thank you. And you?",
        "es": "¡Hola Alice! Estoy muy bien, gracias. ¿Y tú?"
      },
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "sender": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "username": "alice",
        "nativeLanguage": "en"
      },
      "originalText": "Hello Bob! How are you today?",
      "translations": {
        "en": "Hello Bob! How are you today?",
        "es": "¡Hola Bob! ¿Cómo estás hoy?"
      },
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

## 👤 **Step 6: Get User's Chats**

### **Get all chats for a user**
```bash
curl http://localhost:8080/api/chats/user/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
      "participants": [
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "username": "alice",
          "email": "alice@example.com",
          "nativeLanguage": "en"
        },
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
          "username": "bob",
          "email": "bob@example.com",
          "nativeLanguage": "es"
        }
      ],
      "createdBy": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "username": "alice",
        "email": "alice@example.com"
      },
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

## 🔧 **Step 7: Other Operations**

### **Get User Profile**
```bash
curl http://localhost:8080/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **Delete a Chat**
```bash
curl -X DELETE http://localhost:8080/api/chats/CHAT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🌐 **Frontend Integration Examples**

### **JavaScript/TypeScript**

```javascript
// Store token after login
const token = localStorage.getItem('authToken');

// Create authenticated request function
async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
  return response.json();
}

// Create chat with another user
async function createChat(otherUserId) {
  return apiRequest('http://localhost:8080/api/chats', {
    method: 'POST',
    body: JSON.stringify({ otherUserId })
  });
}

// Send message
async function sendMessage(chatId, text) {
  return apiRequest(`http://localhost:8080/api/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ originalText: text })
  });
}

// Get messages
async function getMessages(chatId) {
  return apiRequest(`http://localhost:8080/api/chats/${chatId}/messages`);
}

// Get user's chats
async function getUserChats(userId) {
  return apiRequest(`http://localhost:8080/api/chats/user/${userId}`);
}
```

### **React Hook Example**

```jsx
import { useState, useEffect } from 'react';

function useChats(userId) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/chats/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const result = await response.json();
      if (result.success) {
        setChats(result.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
    setLoading(false);
  };

  const createChat = async (otherUserId) => {
    try {
      const response = await fetch('http://localhost:8080/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ otherUserId })
      });
      const result = await response.json();
      if (result.success) {
        setChats(prev => [result.data, ...prev]);
      }
      return result;
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChats();
    }
  }, [userId]);

  return { chats, loading, createChat, fetchChats };
}
```

---

## 🚨 **Error Handling**

### **Common Error Responses**

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Access token required"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Other user ID is required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Chat not found"
}
```

---

## 🎯 **Complete Workflow Example**

1. **Register users** → Get tokens
2. **Create chat** → Get chat ID
3. **Send messages** → Automatic translation
4. **Get messages** → View conversation
5. **Real-time updates** → Use Socket.IO

**Your AnyTongue backend is ready to use!** 🎉
