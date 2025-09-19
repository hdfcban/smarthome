const Device = require('../models/Device');
const Room = require('../models/Room');
const logger = require('../utils/logger');
const mqttService = require('../services/mqttService');

const deviceController = {
  // Get all devices for a user
  getAllDevices: async (req, res) => {
    try {
      const devices = await Device.find({ userId: req.user.id })
        .populate('roomId', 'name')
        .sort({ name: 1 });

      const rooms = await Room.find({ userId: req.user.id });

      res.json({
        success: true,
        data: {
          devices,
          rooms
        }
      });
    } catch (error) {
      logger.error('Get devices error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch devices'
      });
    }
  },

  // Get single device
  getDevice: async (req, res) => {
    try {
      const device = await Device.findOne({
        _id: req.params.id,
        userId: req.user.id
      }).populate('roomId', 'name');

      if (!device) {
        return res.status(404).json({
          success: false,
          message: 'Device not found'
        });
      }

      res.json({
        success: true,
        data: device
      });
    } catch (error) {
      logger.error('Get device error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch device'
      });
    }
  },

  // Create new device
  createDevice: async (req, res) => {
    try {
      const deviceData = {
        ...req.body,
        userId: req.user.id
      };

      const device = new Device(deviceData);
      await device.save();

      // Send MQTT discovery message
      mqttService.publishDeviceDiscovery(device);

      res.status(201).json({
        success: true,
        data: device
      });
    } catch (error) {
      logger.error('Create device error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create device'
      });
    }
  },

  // Update device
  updateDevice: async (req, res) => {
    try {
      const device = await Device.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { ...req.body, lastUpdated: new Date() },
        { new: true, runValidators: true }
      );

      if (!device) {
        return res.status(404).json({
          success: false,
          message: 'Device not found'
        });
      }

      // Send MQTT command to physical device
      if (req.body.status || req.body.brightness || req.body.color) {
        mqttService.publishDeviceCommand(device, req.body);
      }

      // Broadcast update via WebSocket
      req.io.emit('deviceStatusUpdate', {
        deviceId: device._id,
        ...req.body,
        timestamp: device.lastUpdated
      });

      res.json({
        success: true,
        data: device
      });
    } catch (error) {
      logger.error('Update device error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update device'
      });
    }
  },

  // Delete device
  deleteDevice: async (req, res) => {
    try {
      const device = await Device.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!device) {
        return res.status(404).json({
          success: false,
          message: 'Device not found'
        });
      }

      // Send MQTT device removal message
      mqttService.publishDeviceRemoval(device);

      res.json({
        success: true,
        message: 'Device deleted successfully'
      });
    } catch (error) {
      logger.error('Delete device error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete device'
      });
    }
  },

  // Toggle device on/off
  toggleDevice: async (req, res) => {
    try {
      const device = await Device.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!device) {
        return res.status(404).json({
          success: false,
          message: 'Device not found'
        });
      }

      const newStatus = device.status === 'on' ? 'off' : 'on';
      device.status = newStatus;
      device.lastUpdated = new Date();
      await device.save();

      // Send MQTT command
      mqttService.publishDeviceCommand(device, { status: newStatus });

      // Broadcast update
      req.io.emit('deviceStatusUpdate', {
        deviceId: device._id,
        status: newStatus,
        timestamp: device.lastUpdated
      });

      res.json({
        success: true,
        data: device
      });
    } catch (error) {
      logger.error('Toggle device error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle device'
      });
    }
  }
};

module.exports = deviceController;