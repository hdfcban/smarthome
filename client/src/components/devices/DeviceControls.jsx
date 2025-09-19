import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useWebSocket } from '../../hooks/useWebSocket';

const DeviceControls = ({ device, onClose }) => {
  const [brightness, setBrightness] = useState(device.brightness || 50);
  const [color, setColor] = useState(device.color || '#ffffff');
  const [temperature, setTemperature] = useState(device.targetTemp || 72);
  const { emitDeviceControl } = useWebSocket();

  const handleBrightnessChange = (value) => {
    setBrightness(value);
    emitDeviceControl(device.id, 'brightness', value);
  };

  const handleColorChange = (value) => {
    setColor(value);
    emitDeviceControl(device.id, 'color', value);
  };

  const handleTemperatureChange = (value) => {
    setTemperature(value);
    emitDeviceControl(device.id, 'temperature', value);
  };

  return (
    <motion.div
      className="device-controls-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="device-controls glassmorphism"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="controls-header">
          <h3>{device.name} Controls</h3>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="controls-body">
          {device.type === 'light' && (
            <>
              <div className="control-group">
                <label>Brightness: {brightness}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(e.target.value)}
                  className="slider"
                />
              </div>
              <div className="control-group">
                <label>Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="color-picker"
                />
              </div>
            </>
          )}

          {device.type === 'thermostat' && (
            <div className="control-group">
              <label>Target Temperature: {temperature}°F</label>
              <input
                type="range"
                min="60"
                max="85"
                value={temperature}
                onChange={(e) => handleTemperatureChange(e.target.value)}
                className="slider"
              />
            </div>
          )}

          {device.type === 'speaker' && (
            <div className="control-group">
              <label>Volume: {device.volume || 50}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={device.volume || 50}
                className="slider"
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeviceControls;