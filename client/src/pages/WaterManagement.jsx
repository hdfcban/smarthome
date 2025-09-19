import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BeakerIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const WaterManagement = () => {
  const [waterData, setWaterData] = useState({
    mainTank: { level: 85, capacity: 1000, status: 'normal' },
    backupTank: { level: 60, capacity: 500, status: 'normal' },
    dailyUsage: 245,
    weeklyUsage: 1680,
    monthlyUsage: 7200,
    leakDetected: false,
    qualityScore: 92
  });

  const WaterTankCard = ({ tank, title }) => (
    <motion.div className="water-tank-card glassmorphism" whileHover={{ scale: 1.02 }}>
      <div className="tank-header">
        <h3>{title}</h3>
        <span className={`status-badge ${tank.status}`}>{tank.status}</span>
      </div>

      <div className="tank-visual">
        <div className="tank-container">
          <div 
            className="water-level"
            style={{ height: `${tank.level}%` }}
          />
          <span className="level-text">{tank.level}%</span>
        </div>
      </div>

      <div className="tank-info">
        <div className="info-item">
          <span>Capacity</span>
          <span>{tank.capacity}L</span>
        </div>
        <div className="info-item">
          <span>Current</span>
          <span>{Math.round(tank.capacity * tank.level / 100)}L</span>
        </div>
      </div>
    </motion.div>
  );

  const UsageCard = ({ title, value, unit, icon: Icon, trend }) => (
    <motion.div className="usage-card glassmorphism" whileHover={{ scale: 1.02 }}>
      <div className="usage-header">
        <Icon className="w-6 h-6 text-blue-500" />
        <h4>{title}</h4>
      </div>
      <div className="usage-value">
        {value} <span className="unit">{unit}</span>
      </div>
      {trend && (
        <div className={`trend ${trend > 0 ? 'up' : 'down'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="water-management">
      <div className="page-header">
        <div>
          <h1 className="page-title">Water Management</h1>
          <p className="page-subtitle">Monitor and control your water systems</p>
        </div>
        <button className="btn primary">
          <Cog6ToothIcon className="w-5 h-5" />
          Settings
        </button>
      </div>

      {/* Alerts */}
      {waterData.leakDetected && (
        <motion.div 
          className="alert-banner error"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ExclamationTriangleIcon className="w-6 h-6" />
          <span>Leak detected in main pipeline. Check system immediately.</span>
          <button className="btn secondary small">Acknowledge</button>
        </motion.div>
      )}

      {/* Water Tanks */}
      <div className="section">
        <h2 className="section-title">Water Tanks</h2>
        <div className="tanks-grid">
          <WaterTankCard tank={waterData.mainTank} title="Main Tank" />
          <WaterTankCard tank={waterData.backupTank} title="Backup Tank" />
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="section">
        <h2 className="section-title">Usage Statistics</h2>
        <div className="usage-grid">
          <UsageCard
            title="Today"
            value={waterData.dailyUsage}
            unit="L"
            icon={BeakerIcon}
            trend={-5}
          />
          <UsageCard
            title="This Week"
            value={waterData.weeklyUsage}
            unit="L"
            icon={ChartBarIcon}
            trend={3}
          />
          <UsageCard
            title="This Month"
            value={waterData.monthlyUsage}
            unit="L"
            icon={ChartBarIcon}
            trend={-2}
          />
          <UsageCard
            title="Quality Score"
            value={waterData.qualityScore}
            unit="/100"
            icon={BeakerIcon}
          />
        </div>
      </div>

      {/* Quick Controls */}
      <div className="section">
        <h2 className="section-title">Quick Controls</h2>
        <div className="controls-grid">
          <motion.button 
            className="control-btn glassmorphism"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BeakerIcon className="w-8 h-8" />
            <span>Fill Main Tank</span>
          </motion.button>
          <motion.button 
            className="control-btn glassmorphism"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Cog6ToothIcon className="w-8 h-8" />
            <span>System Check</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default WaterManagement;