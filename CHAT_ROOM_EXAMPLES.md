# Two-User Chat System Examples

## Overview

Your API now supports direct messaging between two users with features like:
- Create chats between two users
- Automatic duplicate prevention
- Real-time messaging with translation
- Delete chats
- Get user's chat list

## Chat Schema

```json
{
  "_id": "chat_id",
  "participants": ["user_id_1", "user_id_2"],
  "createdBy": "user_id_1",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

## API Endpoints

### 1. Create Chat with Another User
**POST** `/api/chats`

```bash
curl -X POST http://localhost:8080/api/chats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "otherUserId": "64f1a2b3c4d5e6f7g8h9i0j2"
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
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 2. Get User's Chats
**GET** `/api/chats/user/:userId`

```bash
curl http://localhost:8080/api/chats/user/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get Specific Chat
**GET** `/api/chats/:chatId`

```bash
curl http://localhost:8080/api/chats/64f1a2b3c4d5e6f7g8h9i0j4 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Delete Chat
**DELETE** `/api/chats/:chatId`

```bash
curl -X DELETE http://localhost:8080/api/chats/64f1a2b3c4d5e6f7g8h9i0j4 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Send Message to Chat
**POST** `/api/chats/:chatId/messages`

```bash
curl -X POST http://localhost:8080/api/chats/64f1a2b3c4d5e6f7g8h9i0j4/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "originalText": "Hello Bob! How are you?"
  }'
```

## Frontend Integration

### React Hook for Chat Rooms

```jsx
import { useState, useEffect } from 'react';

function useChatRooms() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const createChatRoom = async (name, description, isPrivate, participants) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:8080/api/chat-rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, description, isPrivate, participants })
    });
    
    const result = await response.json();
    if (result.success) {
      setChatRooms(prev => [result.data, ...prev]);
    }
    return result;
  };

  const fetchUserChatRooms = async (userId) => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8080/api/chat-rooms/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await response.json();
    if (result.success) {
      setChatRooms(result.data);
    }
    setLoading(false);
    return result;
  };

  const addParticipants = async (chatId, participants) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8080/api/chat-rooms/${chatId}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ participants })
    });
    
    const result = await response.json();
    if (result.success) {
      setChatRooms(prev => prev.map(room => 
        room._id === chatId ? result.data : room
      ));
    }
    return result;
  };

  return {
    chatRooms,
    loading,
    createChatRoom,
    fetchUserChatRooms,
    addParticipants
  };
}

// Usage in component
function ChatRoomList() {
  const { chatRooms, loading, fetchUserChatRooms } = useChatRooms();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchUserChatRooms(userId);
    }
  }, [userId]);

  if (loading) return <div>Loading chat rooms...</div>;

  return (
    <div>
      <h2>Your Chat Rooms</h2>
      {chatRooms.map(room => (
        <div key={room._id} className="chat-room">
          <h3>{room.name}</h3>
          <p>{room.description}</p>
          <p>Participants: {room.participants.length}</p>
          <p>Created by: {room.createdBy.username}</p>
        </div>
      ))}
    </div>
  );
}
```

### Socket.IO Integration for Chat Rooms

```javascript
// Join a specific chat room
socket.emit('join-chat', chatRoomId);

// Listen for new messages in the chat room
socket.on('new-message', (message) => {
  // Display message in user's native language
  const userLanguage = 'en'; // Get from user profile
  const translatedText = message.translations[userLanguage];
  displayMessage(translatedText, message.sender.username);
});

// Send message to chat room
async function sendMessage(chatRoomId, text) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`http://localhost:8080/api/chats/${chatRoomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ originalText: text })
  });
  
  return response.json();
}
```

## Error Handling

### Common Error Responses

**400 Bad Request - Invalid Input:**
```json
{
  "success": false,
  "message": "Chat room name is required (minimum 3 characters)"
}
```

**403 Forbidden - Access Denied:**
```json
{
  "success": false,
  "message": "Access denied - not a participant"
}
```

**404 Not Found - Chat Room Not Found:**
```json
{
  "success": false,
  "message": "Chat room not found"
}
```

## Security Features

- **Authentication Required**: All chat room operations require valid JWT token
- **Participant Validation**: Only participants can access chat room data
- **Creator Permissions**: Only chat room creators can delete rooms
- **Input Validation**: All inputs are validated and sanitized
- **Access Control**: Users can only see chat rooms they participate in

## Complete Chat Room Flow

1. **Create Chat Room** → Get chat room ID
2. **Add Participants** → Invite users to join
3. **Join Socket.IO Room** → Connect for real-time messaging
4. **Send Messages** → Messages are translated and broadcast
5. **Manage Participants** → Add/remove users as needed
6. **Update Details** → Modify name/description
7. **Delete Chat Room** → Remove room and all messages

Your chat room system is now fully functional and ready for your hackathon! 🎉
