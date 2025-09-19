const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: [
      'light', 'thermostat', 'lock', 'camera', 'sensor', 
      'switch', 'outlet', 'speaker', 'tv', 'appliance',
      'water', 'solar', 'battery', 'security'
    ]
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  brand: {
    type: String,
    trim: true,
    maxlength: 50
  },
  model: {
    type: String,
    trim: true,
    maxlength: 100
  },
  status: {
    type: String,
    enum: ['on', 'off', 'idle', 'error', 'offline'],
    default: 'off'
  },
  protocol: {
    type: String,
    enum: ['WiFi', 'Zigbee', 'Z-Wave', 'Bluetooth', 'Matter', 'Thread'],
    default: 'WiFi'
  },
  // Device-specific properties
  brightness: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  color: {
    type: String,
    match: /^#[0-9A-Fa-f]{6}$/,
    default: null
  },
  temperature: {
    current: {
      type: Number,
      default: null
    },
    target: {
      type: Number,
      default: null
    },
    unit: {
      type: String,
      enum: ['celsius', 'fahrenheit'],
      default: 'fahrenheit'
    }
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  energyUsage: {
    type: Number,
    min: 0,
    default: 0
  },
  // Security devices
  motionDetected: {
    type: Boolean,
    default: false
  },
  recording: {
    type: Boolean,
    default: false
  },
  // Lock devices
  locked: {
    type: Boolean,
    default: null
  },
  autoLock: {
    type: Boolean,
    default: false
  },
  // Entertainment devices
  volume: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  input: {
    type: String,
    default: null
  },
  // Water devices
  flowRate: {
    type: Number,
    min: 0,
    default: null
  },
  waterLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  // Solar devices
  powerGeneration: {
    type: Number,
    min: 0,
    default: null
  },
  efficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  // Network info
  ipAddress: {
    type: String,
    default: null
  },
  macAddress: {
    type: String,
    default: null
  },
  signalStrength: {
    type: Number,
    min: -100,
    max: 0,
    default: null
  },
  // Metadata
  icon: {
    type: String,
    default: '🔌'
  },
  tags: [String],
  notes: {
    type: String,
    maxlength: 500
  },
  // Timestamps
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  installDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
deviceSchema.index({ userId: 1, roomId: 1 });
deviceSchema.index({ userId: 1, type: 1 });
deviceSchema.index({ userId: 1, status: 1 });

// Virtual for room name
deviceSchema.virtual('room', {
  ref: 'Room',
  localField: 'roomId',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware
deviceSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Instance methods
deviceSchema.methods.toggle = function() {
  this.status = this.status === 'on' ? 'off' : 'on';
  return this.save();
};

deviceSchema.methods.setBrightness = function(brightness) {
  if (this.type === 'light' && brightness >= 0 && brightness <= 100) {
    this.brightness = brightness;
    return this.save();
  }
  throw new Error('Invalid brightness value or device type');
};

deviceSchema.methods.setColor = function(color) {
  if (this.type === 'light' && /^#[0-9A-Fa-f]{6}$/.test(color)) {
    this.color = color;
    return this.save();
  }
  throw new Error('Invalid color value or device type');
};

module.exports = mongoose.model('Device', deviceSchema);