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

// Socket.IO setup with CORS
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

app.get('/api/devices/:id', (req, res) => {
  const device = devices.find(d => d.id === req.params.id);
  if (!device) {
    return res.status(404).json({ message: 'Device not found' });
  }
  res.json(device);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  // Send initial devices data
  socket.emit('initialDevices', devices);

  socket.on('deviceControl', (data) => {
    console.log('Device control:', data);
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

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});