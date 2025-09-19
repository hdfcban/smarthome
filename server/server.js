const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const roomRoutes = require('./routes/rooms');
const scheduleRoutes = require('./routes/schedules');
const waterRoutes = require('./routes/water');
const solarRoutes = require('./routes/solar');

// Import services
const mqttService = require('./services/mqttService');
const schedulerService = require('./services/schedulerService');
const aiService = require('./services/aiService');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Basic CORS setup
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Body parser
app.use(express.json());

// Routes
app.use('/api/devices', deviceRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('deviceControl', (data) => {
    console.log('Device control:', data);
    // Broadcast the update to all clients
    io.emit('deviceStatusUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smarthome', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', authMiddleware, deviceRoutes);
app.use('/api/rooms', authMiddleware, roomRoutes);
app.use('/api/schedules', authMiddleware, scheduleRoutes);
app.use('/api/water', authMiddleware, waterRoutes);
app.use('/api/solar', authMiddleware, solarRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.IO connection handling
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    // Verify JWT token here
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('deviceControl', async (data) => {
    const { deviceId, command, value } = data;

    try {
      // Update device in database
      // Send MQTT command to actual device
      // Broadcast update to all clients

      io.emit('deviceStatusUpdate', {
        deviceId,
        status: value,
        timestamp: new Date().toISOString()
      });

      logger.info(`Device control: ${deviceId} -> ${command}: ${value}`);
    } catch (error) {
      logger.error('Device control error:', error);
      socket.emit('deviceControlError', { deviceId, error: error.message });
    }
  });

  socket.on('activateScene', async (data) => {
    const { sceneId } = data;
    // Implement scene activation logic
    logger.info(`Scene activated: ${sceneId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Initialize services
mqttService.connect();
schedulerService.start();
aiService.initialize();

// Error handling
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };