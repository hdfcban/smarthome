import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, HomeIcon } from '@heroicons/react/24/outline';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setRooms([
      { id: 1, name: 'Living Room', type: 'living_room', deviceCount: 8, icon: '🛋️', color: '#3b82f6' },
      { id: 2, name: 'Kitchen', type: 'kitchen', deviceCount: 5, icon: '🍽️', color: '#10b981' },
      { id: 3, name: 'Master Bedroom', type: 'bedroom', deviceCount: 6, icon: '🛏️', color: '#8b5cf6' },
      { id: 4, name: 'Office', type: 'office', deviceCount: 3, icon: '💼', color: '#f59e0b' }
    ]);
  }, []);

  const RoomCard = ({ room }) => (
    <motion.div
      className="room-card glassmorphism"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="room-header">
        <div className="room-info">
          <span className="room-icon" style={{ fontSize: '2rem' }}>{room.icon}</span>
          <div>
            <h3 className="room-name">{room.name}</h3>
            <p className="room-type">{room.type.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="room-indicator" style={{ backgroundColor: room.color }} />
      </div>

      <div className="room-stats">
        <div className="stat">
          <span className="stat-value">{room.deviceCount}</span>
          <span className="stat-label">Devices</span>
        </div>
        <div className="stat">
          <span className="stat-value">72°F</span>
          <span className="stat-label">Temperature</span>
        </div>
      </div>

      <div className="room-actions">
        <button className="btn secondary">Manage</button>
        <button className="btn primary">Control</button>
      </div>
    </motion.div>
  );

  return (
    <div className="rooms-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rooms</h1>
          <p className="page-subtitle">{rooms.length} rooms configured</p>
        </div>
        <button className="btn primary">
          <PlusIcon className="w-5 h-5" />
          Add Room
        </button>
      </div>

      <div className="rooms-grid">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;