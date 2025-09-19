import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  BellIcon, 
  Cog6ToothIcon,
  ShieldCheckIcon,
  MoonIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    units: {
      temperature: 'fahrenheit',
      measurement: 'imperial'
    },
    security: {
      twoFactor: false,
      autoLock: true
    }
  });

  const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="settings-section glassmorphism">
      <div className="section-header">
        <Icon className="w-6 h-6" />
        <h3>{title}</h3>
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="toggle-item">
      <span>{label}</span>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="slider"></span>
      </label>
    </div>
  );

  const SelectField = ({ label, value, options, onChange }) => (
    <div className="select-field">
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Customize your smart home experience</p>
        </div>
      </div>

      <div className="settings-grid">
        <SettingsSection title="Profile" icon={UserIcon}>
          <div className="profile-section">
            <div className="profile-avatar">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
                alt="Profile" 
              />
              <button className="change-avatar-btn">Change</button>
            </div>
            <div className="profile-info">
              <div className="form-group">
                <label>Name</label>
                <input type="text" defaultValue="John Doe" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue="john@example.com" />
              </div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Notifications" icon={BellIcon}>
          <ToggleSwitch
            label="Email Notifications"
            checked={settings.notifications.email}
            onChange={(e) => setSettings({
              ...settings,
              notifications: { ...settings.notifications, email: e.target.checked }
            })}
          />
          <ToggleSwitch
            label="Push Notifications"
            checked={settings.notifications.push}
            onChange={(e) => setSettings({
              ...settings,
              notifications: { ...settings.notifications, push: e.target.checked }
            })}
          />
          <ToggleSwitch
            label="SMS Alerts"
            checked={settings.notifications.sms}
            onChange={(e) => setSettings({
              ...settings,
              notifications: { ...settings.notifications, sms: e.target.checked }
            })}
          />
        </SettingsSection>

        <SettingsSection title="Preferences" icon={Cog6ToothIcon}>
          <SelectField
            label="Temperature Unit"
            value={settings.units.temperature}
            options={[
              { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
              { value: 'celsius', label: 'Celsius (°C)' }
            ]}
            onChange={(e) => setSettings({
              ...settings,
              units: { ...settings.units, temperature: e.target.value }
            })}
          />
          <SelectField
            label="Measurement System"
            value={settings.units.measurement}
            options={[
              { value: 'imperial', label: 'Imperial' },
              { value: 'metric', label: 'Metric' }
            ]}
            onChange={(e) => setSettings({
              ...settings,
              units: { ...settings.units, measurement: e.target.value }
            })}
          />
        </SettingsSection>

        <SettingsSection title="Security" icon={ShieldCheckIcon}>
          <ToggleSwitch
            label="Two-Factor Authentication"
            checked={settings.security.twoFactor}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, twoFactor: e.target.checked }
            })}
          />
          <ToggleSwitch
            label="Auto-Lock Devices"
            checked={settings.security.autoLock}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, autoLock: e.target.checked }
            })}
          />
          <button className="btn secondary">Change Password</button>
        </SettingsSection>
      </div>

      <div className="settings-actions">
        <button className="btn secondary">Reset to Defaults</button>
        <button className="btn primary">Save Changes</button>
      </div>
    </div>
  );
};

export default Settings;