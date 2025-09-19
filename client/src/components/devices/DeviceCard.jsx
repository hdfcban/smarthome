import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { 
  PowerIcon, 
  AdjustmentsHorizontalIcon,
  BoltIcon 
} from '@heroicons/react/24/outline';

import { updateDevice } from '../../store/deviceStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import DeviceControls from './DeviceControls';

const DeviceCard = ({ device, compact = false }) => {
  const [showControls, setShowControls] = useState(false);
  const dispatch = useDispatch();
  const { emitDeviceControl } = useWebSocket();

  const handleToggle = async () => {
    const newStatus = device.status === 'on' ? 'off' : 'on';

    // Optimistic update
    dispatch(updateDevice({ 
      deviceId: device.id, 
      updates: { status: newStatus }
    }));

    // Send to server via WebSocket
    emitDeviceControl(device.id, 'toggle', newStatus);
  };

  const getStatusColor = () => {
    switch (device.status) {
      case 'on': return 'text-green-500';
      case 'off': return 'text-gray-500';
      case 'error': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getBatteryLevel = () => {
    if (!device.batteryLevel) return null;

    const level = device.batteryLevel;
    const color = level > 50 ? 'bg-green-500' : level > 20 ? 'bg-yellow-500' : 'bg-red-500';

    return (
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <div className="w-4 h-2 border border-gray-600 rounded-sm">
          <div 
            className={`h-full rounded-sm transition-all ${color}`}
            style={{ width: `${level}%` }}
          />
        </div>
        <span>{level}%</span>
      </div>
    );
  };

  return (
    <motion.div
      className={`device-card glassmorphism ${compact ? 'compact' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="device-card-header">
        <div className="device-info">
          <span className="device-icon">{device.icon}</span>
          <div>
            <h3 className="device-name">{device.name}</h3>
            <p className="device-room">{device.room}</p>
          </div>
        </div>

        <div className="device-status">
          <span className={`status-indicator ${getStatusColor()}`}>
            {device.status}
          </span>
          {getBatteryLevel()}
        </div>
      </div>

      <div className="device-card-body">
        {device.type === 'light' && device.status === 'on' && (
          <div className="quick-info">
            <span>Brightness: {device.brightness}%</span>
            <div 
              className="color-indicator"
              style={{ backgroundColor: device.color }}
            />
          </div>
        )}

        {device.type === 'thermostat' && (
          <div className="quick-info">
            <span>{device.currentTemp}°F → {device.targetTemp}°F</span>
            <span className="mode-indicator">{device.mode}</span>
          </div>
        )}

        {device.energyUsage > 0 && (
          <div className="energy-info">
            <BoltIcon className="w-4 h-4" />
            <span>{device.energyUsage}W</span>
          </div>
        )}
      </div>

      <div className="device-card-actions">
        <motion.button
          className={`toggle-btn ${device.status === 'on' ? 'active' : ''}`}
          onClick={handleToggle}
          whileTap={{ scale: 0.95 }}
        >
          <PowerIcon className="w-5 h-5" />
        </motion.button>

        <motion.button
          className="controls-btn"
          onClick={() => setShowControls(true)}
          whileTap={{ scale: 0.95 }}
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
        </motion.button>
      </div>

      {showControls && (
        <DeviceControls
          device={device}
          onClose={() => setShowControls(false)}
        />
      )}
    </motion.div>
  );
};

export default DeviceCard;