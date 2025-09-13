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
│   └── message.controller.js
├── routes/                 # API routes
│   └── api.routes.js
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

### Health Check
- **GET** `/health` - Check if the server is running

### Messages
- **POST** `/api/chats/:chatId/messages` - Send a new message
- **GET** `/api/chats/:chatId/messages` - Get messages for a chat

### Example: Send Message

```bash
curl -X POST http://localhost:8080/api/chats/CHAT_ID/messages \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "USER_ID",
    "originalText": "Hello, how are you?"
  }'
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

- The translation service currently uses mock translations for development
- Replace the mock implementation in `services/translation.service.js` with actual Gemini API calls
- All schemas include proper validation and indexing
- CORS is configured to allow all origins (adjust for production)

## Next Steps

1. Implement actual Gemini API integration
2. Add user authentication and authorization
3. Add chat creation and management endpoints
4. Implement message pagination
5. Add input validation middleware
6. Add error handling middleware
7. Add logging and monitoring