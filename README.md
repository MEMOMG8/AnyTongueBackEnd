# AnyTongue Backend

A real-time multi-language chat application backend with AI-powered translation and message encryption.

## Features

- 🔐 **User Authentication** - Secure login/signup with JWT tokens
- 💬 **Real-time Chat** - Socket.io powered instant messaging
- 🌍 **AI Translation** - Google Gemini AI for multi-language support
- 🔒 **Message Encryption** - AES-256-CBC encryption for message security
- 📱 **Mobile Optimized** - Responsive design for all devices
- 🗄️ **MongoDB Database** - Scalable data storage with Mongoose ODM

## Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)
- MongoDB database
- Google AI API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AnyTongueBackEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/anytongue
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key
   
   # Google AI API
   GOOGLE_AI_API_KEY=your-google-ai-api-key
   
   # Encryption
   ENCRYPTION_KEY=your-32-character-encryption-key
   
   # Server
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Chat
- `POST /api/chat/create` - Create new chat
- `GET /api/chat/user-chats` - Get user's chats
- `DELETE /api/chat/:id` - Delete chat

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/:chatId` - Get chat messages

## Socket.io Events

### Client to Server
- `join-chat` - Join a chat room
- `leave-chat` - Leave a chat room
- `send-message` - Send a message

### Server to Client
- `new-message` - Receive new message
- `user-joined` - User joined chat
- `user-left` - User left chat

## Project Structure

```
AnyTongueBackEnd/
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   ├── chat.controller.js
│   ├── message.controller.js
│   └── user.controller.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # Database models
│   ├── chat.model.js
│   ├── message.model.js
│   └── user.model.js
├── routes/              # API routes
│   └── api.routes.js
├── services/            # Business logic
│   ├── encryption.service.js
│   └── translation.service.js
├── server.js            # Main server file
├── package.json         # Dependencies
└── README.md           # This file
```

## Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **Message Encryption** - AES-256-CBC encryption for all messages
- **CORS Protection** - Cross-origin resource sharing configuration
- **Input Validation** - Request validation and sanitization

## Development

### Running in Development Mode
```bash
npm run dev
```

### Environment Variables
Make sure to set up all required environment variables in your `.env` file:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `GOOGLE_AI_API_KEY` - Google AI API key for translation
- `ENCRYPTION_KEY` - 32-character key for message encryption
- `PORT` - Server port (default: 5000)

## Deployment

1. **Set production environment variables**
2. **Build the application** (if needed)
3. **Start the server**
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@anytongue.com or create an issue in the repository.