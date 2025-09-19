import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

import { fetchDevices, setFilters } from '../store/deviceStore';
import DeviceCard from '../components/devices/DeviceCard';
import DeviceModal from '../components/devices/DeviceModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Devices = () => {
  const dispatch = useDispatch();
  const { devices, rooms, loading, filters } = useSelector(state => state.devices);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const filteredDevices = devices.filter(device => {
    if (filters.room !== 'all' && device.roomId !== filters.room) return false;
    if (filters.type !== 'all' && device.type !== filters.type) return false;
    if (filters.status !== 'all' && device.status !== filters.status) return false;
    return true;
  });

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="devices-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Devices</h1>
          <p className="page-subtitle">{filteredDevices.length} devices found</p>
        </div>
        <div className="page-actions">
          <motion.button
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
            whileTap={{ scale: 0.95 }}
          >
            <FunnelIcon className="w-5 h-5" />
            Filters
          </motion.button>
          <motion.button
            className="add-btn primary"
            onClick={() => setShowAddModal(true)}
            whileTap={{ scale: 0.95 }}
          >
            <PlusIcon className="w-5 h-5" />
            Add Device
          </motion.button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          className="filters-panel glassmorphism"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="filter-group">
            <label>Room</label>
            <select
              value={filters.room}
              onChange={(e) => handleFilterChange('room', e.target.value)}
            >
              <option value="all">All Rooms</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="light">Lights</option>
              <option value="thermostat">Thermostats</option>
              <option value="lock">Locks</option>
              <option value="camera">Cameras</option>
              <option value="sensor">Sensors</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="on">Online</option>
              <option value="off">Offline</option>
              <option value="error">Error</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Devices Grid */}
      <div className="devices-grid">
        {filteredDevices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
          />
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="empty-state">
          <h3>No devices found</h3>
          <p>Try adjusting your filters or add a new device</p>
        </div>
      )}

      {/* Add Device Modal */}
      {showAddModal && (
        <DeviceModal
          onClose={() => setShowAddModal(false)}
          rooms={rooms}
        />
      )}
    </div>
  );
};

export default Devices;