import api from './api';

export const deviceService = {
  getAllDevices: () => api.get('/devices'),

  getDevice: (deviceId) => api.get(`/devices/${deviceId}`),

  updateDevice: (deviceId, updates) => 
    api.patch(`/devices/${deviceId}`, updates),

  createDevice: (deviceData) => api.post('/devices', deviceData),

  deleteDevice: (deviceId) => api.delete(`/devices/${deviceId}`),

  getDevicesByRoom: (roomId) => api.get(`/devices/room/${roomId}`),

  getDevicesByType: (type) => api.get(`/devices/type/${type}`),

  toggleDevice: (deviceId) => api.post(`/devices/${deviceId}/toggle`),

  setBrightness: (deviceId, brightness) => 
    api.post(`/devices/${deviceId}/brightness`, { brightness }),

  setColor: (deviceId, color) => 
    api.post(`/devices/${deviceId}/color`, { color }),

  setTemperature: (deviceId, temperature) => 
    api.post(`/devices/${deviceId}/temperature`, { temperature }),

  getDeviceHistory: (deviceId, timeRange) => 
    api.get(`/devices/${deviceId}/history?range=${timeRange}`)
};