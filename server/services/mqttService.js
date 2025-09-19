const mqtt = require('mqtt');
const logger = require('../utils/logger');

class MQTTService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  connect() {
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';

    try {
      this.client = mqtt.connect(brokerUrl, {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        keepalive: 60,
        reconnectPeriod: 1000,
      });

      this.client.on('connect', () => {
        this.connected = true;
        logger.info('Connected to MQTT broker');

        // Subscribe to device status topics
        this.client.subscribe('smarthome/+/status');
        this.client.subscribe('smarthome/+/sensor/+');
      });

      this.client.on('message', (topic, message) => {
        this.handleMessage(topic, message.toString());
      });

      this.client.on('error', (error) => {
        logger.error('MQTT connection error:', error);
        this.connected = false;
      });

      this.client.on('close', () => {
        this.connected = false;
        logger.warn('MQTT connection closed');
      });

    } catch (error) {
      logger.error('Failed to connect to MQTT broker:', error);
    }
  }

  handleMessage(topic, message) {
    try {
      const parts = topic.split('/');
      const deviceId = parts[1];
      const messageType = parts[2];

      logger.info(`MQTT message received: ${topic} - ${message}`);

      // Parse message data
      let data;
      try {
        data = JSON.parse(message);
      } catch (e) {
        data = { value: message };
      }

      // Handle different message types
      switch (messageType) {
        case 'status':
          this.handleStatusUpdate(deviceId, data);
          break;
        case 'sensor':
          this.handleSensorData(deviceId, data);
          break;
        default:
          logger.warn(`Unknown MQTT message type: ${messageType}`);
      }

    } catch (error) {
      logger.error('Error handling MQTT message:', error);
    }
  }

  handleStatusUpdate(deviceId, data) {
    // Update device status in database
    // Broadcast to connected clients via WebSocket
    logger.info(`Device ${deviceId} status update:`, data);
  }

  handleSensorData(deviceId, data) {
    // Store sensor data
    // Trigger alerts if necessary
    logger.info(`Device ${deviceId} sensor data:`, data);
  }

  publishDeviceCommand(device, command) {
    if (!this.connected) {
      logger.error('MQTT not connected, cannot send command');
      return;
    }

    const topic = `smarthome/${device._id}/command`;
    const payload = JSON.stringify({
      command: command,
      timestamp: new Date().toISOString()
    });

    this.client.publish(topic, payload, (error) => {
      if (error) {
        logger.error('Failed to publish MQTT command:', error);
      } else {
        logger.info(`MQTT command sent to ${device.name}: ${payload}`);
      }
    });
  }

  publishDeviceDiscovery(device) {
    if (!this.connected) return;

    const topic = `homeassistant/${device.type}/${device._id}/config`;
    const config = {
      name: device.name,
      unique_id: device._id,
      device_class: device.type,
      state_topic: `smarthome/${device._id}/status`,
      command_topic: `smarthome/${device._id}/command`
    };

    this.client.publish(topic, JSON.stringify(config));
  }

  publishDeviceRemoval(device) {
    if (!this.connected) return;

    const topic = `homeassistant/${device.type}/${device._id}/config`;
    this.client.publish(topic, '', { retain: true });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}

module.exports = new MQTTService();