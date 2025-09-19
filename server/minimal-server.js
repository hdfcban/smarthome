const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Basic CORS setup
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));

// Create Socket.IO server with CORS
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type"]
    },
    transports: ['polling', 'websocket'],
    allowEIO3: true,
    pingTimeout: 60000
});

// Basic API endpoint
app.get('/api/devices', (req, res) => {
    console.log('API request received for /api/devices');
    res.json([
        { 
            id: '1',
            name: 'Test Light',
            type: 'light',
            status: 'on',
            room: 'Living Room',
            brightness: 80
        }
    ]);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.emit('connection_success', { message: 'Successfully connected to server' });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});