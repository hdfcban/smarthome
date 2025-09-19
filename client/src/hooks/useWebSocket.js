import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { updateDeviceStatus } from '../store/deviceStore';
import toast from 'react-hot-toast';

export const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    
    const connectWithRetry = () => {
      console.log('Attempting to connect to WebSocket server...');
      const newSocket = io('http://localhost:5000', {
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true,
        autoConnect: true,
        withCredentials: true,
        path: '/socket.io'
      });

      newSocket.on('connect', () => {
        setConnected(true);
        toast.success('Connected to Smart Home System');
      });

      newSocket.on('connect_error', (error) => {
        console.log('Connection error:', error);
        setConnected(false);
        if (retryCount < maxRetries) {
          retryCount++;
          toast.error(`Connection attempt ${retryCount}/${maxRetries}. Retrying...`);
          setTimeout(() => {
            newSocket.connect();
          }, 3000);
        } else {
          toast.error('Unable to connect to Smart Home System. Please check if the server is running on port 5000.');
          // Reset retry count after a longer delay and try again
          setTimeout(() => {
            retryCount = 0;
            newSocket.connect();
          }, 10000);
        }
      });

      // Add success handler
      newSocket.on('connection_success', (data) => {
        console.log('Server connection confirmed:', data);
        retryCount = 0;
      });

      return newSocket;
    };

    const newSocket = connectWithRetry();

    newSocket.on('disconnect', () => {
      setConnected(false);
      toast.error('Disconnected from Smart Home System');
    });

    // Device status updates
    newSocket.on('deviceStatusUpdate', (data) => {
      dispatch(updateDeviceStatus(data));
    });

    // Security alerts
    newSocket.on('securityAlert', (alert) => {
      toast.error(`Security Alert: ${alert.message}`, {
        duration: 6000,
        icon: '🚨'
      });
    });

    // Energy notifications
    newSocket.on('energyNotification', (notification) => {
      toast.success(`Energy: ${notification.message}`, {
        icon: '⚡'
      });
    });

    // Water system alerts
    newSocket.on('waterAlert', (alert) => {
      toast.warning(`Water System: ${alert.message}`, {
        icon: '💧'
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  const emitDeviceControl = (deviceId, command, value) => {
    if (socket && connected) {
      socket.emit('deviceControl', { deviceId, command, value });
    }
  };

  const emitSceneActivation = (sceneId) => {
    if (socket && connected) {
      socket.emit('activateScene', { sceneId });
    }
  };

  return {
    socket,
    connected,
    emitDeviceControl,
    emitSceneActivation
  };
};