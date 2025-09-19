import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  ClockIcon, 
  PlayIcon, 
  PauseIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

const Schedules = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: 'Good Morning',
      time: '07:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      actions: ['Turn on bedroom lights', 'Start coffee maker', 'Open blinds'],
      active: true
    },
    {
      id: 2,
      name: 'Movie Night',
      time: '20:00',
      days: ['fri', 'sat'],
      actions: ['Dim living room lights', 'Turn on TV', 'Close blinds'],
      active: true
    },
    {
      id: 3,
      name: 'Security Mode',
      time: '23:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      actions: ['Lock all doors', 'Turn off all lights', 'Arm security system'],
      active: false
    }
  ]);

  const ScheduleCard = ({ schedule }) => (
    <motion.div
      className="schedule-card glassmorphism"
      whileHover={{ scale: 1.02 }}
    >
      <div className="schedule-header">
        <div className="schedule-info">
          <h3 className="schedule-name">{schedule.name}</h3>
          <div className="schedule-time">
            <ClockIcon className="w-4 h-4" />
            <span>{schedule.time}</span>
          </div>
        </div>
        <div className="schedule-controls">
          <button 
            className={`toggle-btn ${schedule.active ? 'active' : ''}`}
            onClick={() => toggleSchedule(schedule.id)}
          >
            {schedule.active ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="schedule-days">
        {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => (
          <span 
            key={day}
            className={`day-badge ${schedule.days.includes(day) ? 'active' : ''}`}
          >
            {day.charAt(0).toUpperCase()}
          </span>
        ))}
      </div>

      <div className="schedule-actions">
        <h4>Actions:</h4>
        <ul>
          {schedule.actions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );

  const toggleSchedule = (id) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id 
        ? { ...schedule, active: !schedule.active }
        : schedule
    ));
  };

  return (
    <div className="schedules-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Schedules & Automation</h1>
          <p className="page-subtitle">{schedules.length} schedules configured</p>
        </div>
        <button className="btn primary">
          <PlusIcon className="w-5 h-5" />
          New Schedule
        </button>
      </div>

      <div className="schedules-grid">
        {schedules.map(schedule => (
          <ScheduleCard key={schedule.id} schedule={schedule} />
        ))}
      </div>

      <div className="section">
        <h2 className="section-title">Quick Scenes</h2>
        <div className="scenes-grid">
          <motion.button 
            className="scene-btn glassmorphism"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="scene-icon">🌅</span>
            <span>Good Morning</span>
          </motion.button>
          <motion.button 
            className="scene-btn glassmorphism"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="scene-icon">🏠</span>
            <span>I'm Home</span>
          </motion.button>
          <motion.button 
            className="scene-btn glassmorphism"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="scene-icon">🌙</span>
            <span>Good Night</span>
          </motion.button>
          <motion.button 
            className="scene-btn glassmorphism"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="scene-icon">🎬</span>
            <span>Movie Time</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Schedules;