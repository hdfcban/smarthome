import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { addDevice } from '../../store/deviceStore';
import { deviceService } from '../../services/deviceService';
import toast from 'react-hot-toast';

const DeviceModal = ({ onClose, rooms }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    type: 'light',
    roomId: '',
    brand: '',
    model: '',
    icon: '💡'
  });

  const deviceTypes = [
    { value: 'light', label: 'Light', icon: '💡' },
    { value: 'thermostat', label: 'Thermostat', icon: '🌡️' },
    { value: 'lock', label: 'Lock', icon: '🔒' },
    { value: 'camera', label: 'Camera', icon: '📹' },
    { value: 'sensor', label: 'Sensor', icon: '📡' },
    { value: 'switch', label: 'Switch', icon: '🔌' },
    { value: 'speaker', label: 'Speaker', icon: '🔊' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await deviceService.createDevice(formData);
      dispatch(addDevice(response.data));
      toast.success('Device added successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to add device');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && {
        icon: deviceTypes.find(t => t.value === value)?.icon || '🔌'
      })
    }));
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content glassmorphism"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add New Device</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Device Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Living Room Light"
              required
            />
          </div>

          <div className="form-group">
            <label>Device Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {deviceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Room</label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
            >
              <option value="">Select a room</option>
              {rooms.map(room => (
                <option key={room._id} value={room._id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Philips"
              />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Hue A19"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn secondary">
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Add Device
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DeviceModal;