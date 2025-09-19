import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deviceService } from '../services/deviceService';

// Async thunks
export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deviceService.getAllDevices();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ deviceId, updates }, { rejectWithValue }) => {
    try {
      const response = await deviceService.updateDevice(deviceId, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const deviceSlice = createSlice({
  name: 'devices',
  initialState: {
    devices: [],
    rooms: [],
    loading: false,
    error: null,
    selectedDevice: null,
    filters: {
      room: 'all',
      type: 'all',
      status: 'all'
    }
  },
  reducers: {
    setSelectedDevice: (state, action) => {
      state.selectedDevice = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateDeviceStatus: (state, action) => {
      const { deviceId, status } = action.payload;
      const device = state.devices.find(d => d.id === deviceId);
      if (device) {
        device.status = status;
        device.lastUpdated = new Date().toISOString();
      }
    },
    addDevice: (state, action) => {
      state.devices.push(action.payload);
    },
    removeDevice: (state, action) => {
      state.devices = state.devices.filter(d => d.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.devices;
        state.rooms = action.payload.rooms;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const index = state.devices.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.devices[index] = action.payload;
        }
      });
  }
});

export const { 
  setSelectedDevice, 
  setFilters, 
  updateDeviceStatus,
  addDevice,
  removeDevice 
} = deviceSlice.actions;

export default deviceSlice.reducer;