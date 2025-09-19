import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SunIcon, 
  BoltIcon, 
  Battery100Icon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const SolarMonitoring = () => {
  const [solarData, setSolarData] = useState({
    currentGeneration: 3.2,
    dailyGeneration: 28.5,
    monthlyGeneration: 845,
    efficiency: 87,
    batteryLevel: 92,
    gridFeedIn: 1.8,
    savings: 156.30
  });

  const MetricCard = ({ title, value, unit, icon: Icon, color = 'blue' }) => (
    <motion.div 
      className="metric-card glassmorphism"
      whileHover={{ scale: 1.02 }}
    >
      <div className="metric-header">
        <Icon className={`w-6 h-6 text-${color}-500`} />
        <h3>{title}</h3>
      </div>
      <div className="metric-value">
        {value} <span className="unit">{unit}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="solar-monitoring">
      <div className="page-header">
        <div>
          <h1 className="page-title">Solar Energy</h1>
          <p className="page-subtitle">Monitor your solar power generation</p>
        </div>
      </div>

      {/* Current Status */}
      <div className="section">
        <h2 className="section-title">Current Status</h2>
        <div className="metrics-grid">
          <MetricCard
            title="Generation Now"
            value={solarData.currentGeneration}
            unit="kW"
            icon={SunIcon}
            color="orange"
          />
          <MetricCard
            title="Efficiency"
            value={solarData.efficiency}
            unit="%"
            icon={ChartBarIcon}
            color="green"
          />
          <MetricCard
            title="Battery Level"
            value={solarData.batteryLevel}
            unit="%"
            icon={Battery100Icon}
            color="blue"
          />
          <MetricCard
            title="Grid Feed-in"
            value={solarData.gridFeedIn}
            unit="kW"
            icon={BoltIcon}
            color="purple"
          />
        </div>
      </div>

      {/* Production Summary */}
      <div className="section">
        <h2 className="section-title">Production Summary</h2>
        <div className="production-cards">
          <motion.div className="production-card glassmorphism" whileHover={{ scale: 1.02 }}>
            <h3>Today</h3>
            <div className="production-value">
              {solarData.dailyGeneration}
              <span className="unit">kWh</span>
            </div>
            <div className="production-trend up">↑ 12%</div>
          </motion.div>
          <motion.div className="production-card glassmorphism" whileHover={{ scale: 1.02 }}>
            <h3>This Month</h3>
            <div className="production-value">
              {solarData.monthlyGeneration}
              <span className="unit">kWh</span>
            </div>
            <div className="production-trend up">↑ 8%</div>
          </motion.div>
          <motion.div className="production-card glassmorphism" whileHover={{ scale: 1.02 }}>
            <h3>Savings</h3>
            <div className="production-value">
              ${solarData.savings}
              <span className="unit">this month</span>
            </div>
            <div className="production-trend up">↑ $23</div>
          </motion.div>
        </div>
      </div>

      {/* Solar Panel Status */}
      <div className="section">
        <h2 className="section-title">Panel Status</h2>
        <div className="panel-grid">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div 
              key={i}
              className="panel-indicator"
              whileHover={{ scale: 1.1 }}
              style={{
                background: `linear-gradient(135deg, #f59e0b ${Math.random() * 100}%, transparent 0%)`
              }}
            >
              <span className="panel-number">{i + 1}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolarMonitoring;