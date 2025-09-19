import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from './hooks/useAuth';
import { useWebSocket } from './hooks/useWebSocket';

// Components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Rooms from './pages/Rooms';
import Schedules from './pages/Schedules';
import WaterManagement from './pages/WaterManagement';
import SolarMonitoring from './pages/SolarMonitoring';
import Settings from './pages/Settings';

// Styles
import './App.scss';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const { user, loading } = useAuth();
  const { connected, devices } = useWebSocket();

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app" data-theme={currentTheme}>
      {/* Particle Background */}
      <div className="particle-background" />

          <Header 
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            onThemeChange={setCurrentTheme}
            currentTheme={currentTheme}
            connected={connected}
          />

          <div className="app-body">
            <Sidebar 
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <main className="main-content">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/devices" element={<Devices />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/schedules" element={<Schedules />} />
                  <Route path="/water" element={<WaterManagement />} />
                  <Route path="/solar" element={<SolarMonitoring />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>

          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'toast-notification',
              duration: 4000,
            }}
          />
        </div>
  );
}

export default App;