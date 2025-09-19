const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
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
    enum: [
      'living_room', 'bedroom', 'kitchen', 'bathroom', 
      'dining_room', 'office', 'garage', 'basement',
      'attic', 'hallway', 'laundry', 'guest_room',
      'family_room', 'study', 'pantry', 'closet'
    ],
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  color: {
    type: String,
    match: /^#[0-9A-Fa-f]{6}$/,
    default: '#3b82f6'
  },
  icon: {
    type: String,
    default: '🏠'
  },
  floor: {
    type: Number,
    default: 1
  },
  area: {
    type: Number, // Square feet/meters
    min: 0
  },
  temperature: {
    current: {
      type: Number,
      default: null
    },
    target: {
      type: Number,
      default: null
    }
  },
  humidity: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  occupancy: {
    type: Boolean,
    default: false
  },
  lightLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for device count
roomSchema.virtual('deviceCount', {
  ref: 'Device',
  localField: '_id',
  foreignField: 'roomId',
  count: true
});

// Indexes
roomSchema.index({ userId: 1, name: 1 }, { unique: true });
roomSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Room', roomSchema);