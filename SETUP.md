# AnyTongue Backend Setup Guide

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd AnyTongueBackEnd
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with the following variables:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/anytongue
   
   # JWT Secret (change this!)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Google AI API Key
   GOOGLE_AI_API_KEY=your-google-ai-api-key-here
   
   # Encryption Key (32 characters)
   ENCRYPTION_KEY=your-32-character-encryption-key-here
   
   # Server
   PORT=5000
   NODE_ENV=development
   ```

3. **Start the Server**
   ```bash
   npm run dev
   ```

## Required Services

### MongoDB
- Install MongoDB locally or use MongoDB Atlas
- Update `MONGODB_URI` in your `.env` file

### Google AI API
- Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Add to `GOOGLE_AI_API_KEY` in your `.env` file

## Security Notes

- **JWT_SECRET**: Use a strong, random secret key
- **ENCRYPTION_KEY**: Must be exactly 32 characters
- **MONGODB_URI**: Use authentication in production

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string format

2. **Google AI API Error**
   - Verify API key is correct
   - Check API quota limits

3. **Port Already in Use**
   - Change PORT in `.env` file
   - Or kill process using the port

### Getting Help

- Check the main README.md for detailed documentation
- Create an issue in the repository
- Contact the development team
