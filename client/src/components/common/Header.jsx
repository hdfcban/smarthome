import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bars3Icon, 
  BellIcon,
  MoonIcon,
  SunIcon,
  WifiIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline';

const Header = ({ onMenuToggle, onThemeChange, currentTheme, connected }) => {
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    onThemeChange(newTheme);
  };

  return (
    <header className="app-header glassmorphism">
      <div className="header-left">
        <motion.button
          className="menu-toggle"
          onClick={onMenuToggle}
          whileTap={{ scale: 0.95 }}
        >
          <Bars3Icon className="w-6 h-6" />
        </motion.button>

        <div className="header-title">
          <h1>SmartHome AI</h1>
          <div className="connection-status">
            {connected ? (
              <div className="connected">
                <WifiIcon className="w-4 h-4" />
                <span>Connected</span>
              </div>
            ) : (
              <div className="disconnected">
                <SignalSlashIcon className="w-4 h-4" />
                <span>Offline</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="header-right">
        <motion.button
          className="theme-toggle"
          onClick={toggleTheme}
          whileTap={{ scale: 0.95 }}
        >
          {currentTheme === 'dark' ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </motion.button>

        <motion.button
          className="notifications"
          whileTap={{ scale: 0.95 }}
        >
          <BellIcon className="w-5 h-5" />
          <span className="notification-badge">3</span>
        </motion.button>

        <div className="user-profile">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
            alt="User" 
            className="profile-avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;