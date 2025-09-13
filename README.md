# AnyTongue Backend

A real-time, multi-language chat application backend built with Node.js, Express.js, MongoDB, and Socket.IO. Features AI-powered translation using Google Gemini API with a "Translate on Write" strategy.

## Features

- **Real-time messaging** with Socket.IO
- **Multi-language support** with automatic translation
- **Translate on Write** strategy for optimal performance
- **JWT Authentication** with bearer tokens
- **User management** with secure password hashing
- **MongoDB** for data persistence with Mongoose ODM
- **RESTful API** for message management
- **CORS enabled** for frontend integration

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **AI Translation**: Google Gemini API
- **Environment**: dotenv for configuration

## Project Structure

```
AnyTongueBackEnd/
├── models/                 # Mongoose schemas
│   ├── user.model.js      # User schema
│   ├── chat.model.js      # Chat schema
│   └── message.model.js   # Message schema
├── controllers/            # Route controllers
│   ├── user.controller.js # User operations
│   ├── chat.controller.js # Chat operations
│   └── message.controller.js # Message operations
├── routes/                 # API routes
│   ├── api.routes.js      # Main API routes
│   └── chat.routes.js    # Chat-specific routes
├── middleware/             # Custom middleware
│   └── auth.js            # JWT authentication
├── services/               # Business logic services
│   └── translation.service.js
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
└── README.md              # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Update the `.env` file with your actual values:

```env
PORT=8080
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/anytongue?retryWrites=true&w=majority
GEMINI_API_KEY=your_actual_gemini_api_key_here
JWT_SECRET=your_jwt_secret_for_production
```

### 3. MongoDB Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string and update `MONGO_URI` in `.env`
4. Ensure your IP is whitelisted in Atlas

### 4. Google Gemini API Setup

1. Get your API key from Google AI Studio
2. Update `GEMINI_API_KEY` in `.env`

### 5. Run the Application

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:8080`

## API Endpoints

### Public Endpoints (No Authentication Required)

#### User Management
- **POST** `/api/users` - Register a new user
- **POST** `/api/users/login` - Login user

**Register User:**
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

**Login User:**
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

### Protected Endpoints (Bearer Token Required)

#### User Management
- **GET** `/api/users/:userId` - Get user profile

#### Chat Management
- **POST** `/api/chats` - Create a new chat with another user
- **GET** `/api/chats/user/:userId` - Get all chats for a user
- **GET** `/api/chats/:chatId` - Get specific chat details
- **DELETE** `/api/chats/:chatId` - Delete a chat and all its messages

#### Messaging
- **POST** `/api/chats/:chatId/messages` - Send a message
- **GET** `/api/chats/:chatId/messages` - Get messages for a chat

### Example: Create Chat
```bash
curl -X POST http://localhost:8080/api/chats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "otherUserId": "USER_ID_2"
  }'
```

### Example: Send Message
```bash
curl -X POST http://localhost:8080/api/chats/CHAT_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "originalText": "Hello, how are you?"
  }'
```

### Example: Get Messages
```bash
curl http://localhost:8080/api/chats/CHAT_ID/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Socket.IO Events

### Client to Server
- `join-chat` - Join a chat room
- `leave-chat` - Leave a chat room

### Server to Client
- `new-message` - New message received in the chat

## Core Logic: "Translate on Write"

1. User sends a message via POST `/api/chats/:chatId/messages`
2. Backend identifies all participants in the chat
3. Retrieves each participant's native language
4. Calls Gemini API to translate the message into each language
5. Saves a single message document with translations map
6. Broadcasts the complete message object to all clients in the chat room

## Development Notes

- ✅ Google Gemini API integration is fully implemented
- ✅ JWT authentication and authorization is complete
- ✅ All chat creation and management endpoints are working
- ✅ Real-time messaging with Socket.IO is functional
- ✅ Optimized translation system (only translates when needed)
- ✅ All schemas include proper validation and indexing
- ✅ CORS is configured to allow all origins (adjust for production)
- ✅ Controllers are organized by functionality (user, chat, message)

## Features Implemented

- **User Management**: Registration, login, profile management
- **Chat System**: One-on-one chat creation and management
- **Real-time Messaging**: Socket.IO integration for instant updates
- **AI Translation**: Google Gemini API with optimized translation logic
- **Authentication**: JWT bearer token system
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful endpoints with proper error handling

## Ready for Production

The backend is fully functional and ready for frontend integration. All core features are implemented and tested.