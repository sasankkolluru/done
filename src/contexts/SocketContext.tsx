// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ 
  socket: null,
  isConnected: false 
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user?.id) {
      // Initialize socket connection
      const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        upgrade: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        timeout: 20000,
        forceNew: true,
        auth: {
          token: localStorage.getItem('token') || ''
        },
        // Add Vite-specific options
        withCredentials: true,
        autoConnect: true
      });

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
        // Join user-specific room for private messages
        socket.emit('join', { userId: user.id });
      });

      socket.on('disconnect', (reason: string) => {
        console.log('Disconnected from WebSocket server:', reason);
        setIsConnected(false);
      });

      socket.on('connect_error', (error: Error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
        // Try to reconnect after a delay
        setTimeout(() => {
          socket.connect();
        }, 1000);
      });

      // Handle reconnection events
      socket.on('reconnect_attempt', (attempt: number) => {
        console.log(`Attempting to reconnect (${attempt})...`);
      });

      socket.on('reconnect_failed', () => {
        console.error('Failed to reconnect to WebSocket server');
      });

      socketRef.current = socket;

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
          setIsConnected(false);
        }
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ 
      socket: socketRef.current,
      isConnected 
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;