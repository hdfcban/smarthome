const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Body parser middleware
app.use(express.json());

// Mock devices data
const devices = [
  {
    id: '1',
    name: 'Living Room Light',
    type: 'light',
    status: 'on',
    room: 'Living Room',
    icon: '💡',
    brightness: 80,
    color: '#ffffff'
  },
  {
    id: '2',
    name: 'Kitchen Thermostat',
    type: 'thermostat',
    status: 'on',
    room: 'Kitchen',
    icon: '🌡️',
    currentTemp: 72,
    targetTemp: 74
  }
];

// API Routes
app.get('/api/devices', (req, res) => {
  res.json(devices);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('deviceControl', (data) => {
    console.log('Device control:', data);
    // Update device status in mock data
    const device = devices.find(d => d.id === data.deviceId);
    if (device) {
      if (data.command === 'toggle') {
        device.status = data.value;
      }
      // Broadcast the update to all clients
      io.emit('deviceStatusUpdate', device);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});