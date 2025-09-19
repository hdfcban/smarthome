const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const winston = require('winston');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');

// Import services
const mqttService = require('./services/mqttService');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Apply middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure MongoDB
mongoose.set('strictQuery', false);

// Initialize server
const initializeServer = async () => {
  try {
    // Skip MongoDB connection temporarily
    console.log('Starting server without MongoDB...');
    
    // Create mock test user
    const testUser = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@example.com'
    };
    console.log('Using mock test user');

    // Create mock test data
    const mockRoom = {
      _id: '507f1f77bcf86cd799439012',
      name: 'Living Room',
      type: 'living',
      userId: testUser._id
    };

    const mockDevice = {
      _id: '507f1f77bcf86cd799439013',
      name: 'Test Light',
      type: 'light',
      brand: 'Test Brand',
      model: 'Test Model',
      status: false,
      userId: testUser._id,
      roomId: mockRoom._id
    };

    console.log('Mock data created');

    // Mount routes with user middleware
    app.use('/api/devices', async (req, res, next) => {
      try {
        // Add test user to request
        req.user = testUser;
        next();
      } catch (error) {
        console.error('Middleware error:', error);
        res.status(500).json({
          success: false,
          message: error.message || 'Internal server error'
        });
      }
    }, deviceRoutes);

    app.use('/api/auth', authRoutes);

    // Create HTTP server
    const server = http.createServer(app);

    // Configure Socket.IO
    const io = socketIo(server, {
      cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      socket.emit('connection_success', { message: 'Successfully connected to server' });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Initialize MQTT service
    mqttService.connect();

    // Error handling middleware
    app.use(errorHandler);

    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
  }
};

// Start the server
initializeServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});