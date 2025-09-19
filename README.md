# SmartHome AI

An intelligent home automation system built with React, Node.js, and AI integration.

## Features

- 🏠 **Device Management** - Control lights, thermostats, locks, cameras, and more
- 🎯 **Smart Automation** - AI-powered scenes and schedules
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔒 **Secure** - End-to-end encryption and secure authentication
- 💧 **Water Management** - Monitor usage, detect leaks, control systems
- ⚡ **Solar Monitoring** - Track energy generation and efficiency
- 🗣️ **Voice Control** - Natural language device control
- 📊 **Analytics** - Energy usage, water consumption, and more
- 🔄 **Real-time Updates** - WebSocket connections for instant updates
- 🏢 **Room-based Organization** - Logical device grouping

## Tech Stack

### Frontend
- React 18 with Hooks
- Redux Toolkit for state management
- Framer Motion for animations
- Socket.IO for real-time updates
- Tailwind CSS + SCSS for styling
- Chart.js for data visualization

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for WebSocket connections
- MQTT for IoT device communication
- Redis for caching
- Winston for logging
- JWT authentication

### Infrastructure
- Docker & Docker Compose
- MQTT Broker (Mosquitto)
- MongoDB database
- Redis cache

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smarthome-ai
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp server/.env.example server/.env
   cp client/.env.example client/.env

   # Edit the files with your configuration
   ```

4. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

   Or start services individually:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MQTT Broker: localhost:1883

## Project Structure

```
smarthome-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── styles/        # SCSS styles
│   └── public/
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   └── utils/            # Utility functions
├── config/               # Configuration files
└── docker-compose.yml    # Docker setup
```

## Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smarthome
REDIS_URL=redis://localhost:6379
MQTT_BROKER_URL=mqtt://localhost:1883
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SERVER_URL=http://localhost:5000
REACT_APP_ENABLE_AI=true
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Devices
- `GET /api/devices` - Get all devices
- `POST /api/devices` - Create device
- `PATCH /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `POST /api/devices/:id/toggle` - Toggle device

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `PATCH /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

## WebSocket Events

### Client to Server
- `deviceControl` - Control a device
- `activateScene` - Activate a scene

### Server to Client
- `deviceStatusUpdate` - Device status changed
- `securityAlert` - Security notification
- `energyNotification` - Energy usage alert

## MQTT Topics

### Device Commands
- `smarthome/{deviceId}/command` - Send commands to devices
- `smarthome/{deviceId}/status` - Device status updates

### Sensor Data
- `smarthome/{deviceId}/sensor/{type}` - Sensor readings

## Development

### Adding New Device Types

1. **Update Device Model**
   ```javascript
   // server/models/Device.js
   type: {
     enum: [...existing, 'newType']
   }
   ```

2. **Create Device Component**
   ```javascript
   // client/src/components/devices/NewDeviceCard.jsx
   ```

3. **Add Device Controls**
   ```javascript
   // client/src/components/devices/NewDeviceControls.jsx
   ```

### Adding New Pages

1. **Create Page Component**
   ```javascript
   // client/src/pages/NewPage.jsx
   ```

2. **Add Route**
   ```javascript
   // client/src/App.jsx
   <Route path="/newpage" element={<NewPage />} />
   ```

3. **Update Navigation**
   ```javascript
   // client/src/components/common/Sidebar.jsx
   ```

## Deployment

### Production Build
```bash
# Build client
cd client && npm run build

# Start production server
cd server && npm start
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.

---

**SmartHome AI** - Making homes smarter, one device at a time! 🏠✨
