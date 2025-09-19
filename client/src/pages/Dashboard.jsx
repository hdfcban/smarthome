import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  BoltIcon, 
  BeakerIcon,
  SunIcon,
  ShieldCheckIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

import { fetchDevices } from '../store/deviceStore';
import DeviceCard from '../components/devices/DeviceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { devices, loading } = useSelector(state => state.devices);
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    energyUsage: 0,
    waterUsage: 0,
    solarGeneration: 0,
    securityStatus: 'Armed'
  });

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    if (devices.length > 0) {
      const activeDevices = devices.filter(d => d.status === 'on').length;
      const energyUsage = devices.reduce((sum, d) => sum + (d.energyUsage || 0), 0);

      setStats({
        totalDevices: devices.length,
        activeDevices,
        energyUsage,
        waterUsage: 245, // Mock data
        solarGeneration: 3.2, // Mock data
        securityStatus: 'Armed'
      });
    }
  }, [devices]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const StatCard = ({ title, value, icon: Icon, color, unit = '' }) => (
    <motion.div
      className={`stat-card glassmorphism border-l-4 border-${color}-500`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="stat-header">
        <Icon className={`w-8 h-8 text-${color}-500`} />
        <h3 className="stat-title">{title}</h3>
      </div>
      <div className="stat-value">
        {value}{unit}
      </div>
    </motion.div>
  );

  const recentDevices = devices.slice(0, 6);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to your Smart Home</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Devices"
          value={stats.totalDevices}
          icon={HomeIcon}
          color="blue"
        />
        <StatCard
          title="Active Now"
          value={stats.activeDevices}
          icon={BoltIcon}
          color="green"
        />
        <StatCard
          title="Energy Usage"
          value={stats.energyUsage}
          icon={ChartBarIcon}
          color="yellow"
          unit="W"
        />
        <StatCard
          title="Water Usage"
          value={stats.waterUsage}
          icon={BeakerIcon}
          color="blue"
          unit="L"
        />
        <StatCard
          title="Solar Generation"
          value={stats.solarGeneration}
          icon={SunIcon}
          color="orange"
          unit="kW"
        />
        <StatCard
          title="Security"
          value={stats.securityStatus}
          icon={ShieldCheckIcon}
          color="green"
        />
      </div>

      {/* Recent Devices */}
      <div className="dashboard-section">
        <h2 className="section-title">Recent Devices</h2>
        <div className="devices-grid">
          {recentDevices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              compact={true}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <motion.button
            className="action-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Good Night Scene
          </motion.button>
          <motion.button
            className="action-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Away Mode
          </motion.button>
          <motion.button
            className="action-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Movie Time
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;