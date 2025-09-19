import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  CpuChipIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  BeakerIcon,
  SunIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/devices', icon: CpuChipIcon, label: 'Devices' },
    { path: '/rooms', icon: BuildingOfficeIcon, label: 'Rooms' },
    { path: '/schedules', icon: CalendarIcon, label: 'Schedules' },
    { path: '/water', icon: BeakerIcon, label: 'Water' },
    { path: '/solar', icon: SunIcon, label: 'Solar' },
    { path: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            className="sidebar glassmorphism"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="sidebar-header">
              <h2>Navigation</h2>
              <button className="close-btn" onClick={onClose}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="sidebar-nav">
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                  onClick={onClose}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="sidebar-footer">
              <div className="ai-status">
                <div className="ai-indicator active" />
                <span>AI Assistant Online</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;