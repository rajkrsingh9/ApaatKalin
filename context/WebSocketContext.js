"use client"
import React, { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received GPS update:', data);
      setLocation(data);  // Update the location with new GPS data
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();  // Cleanup on component unmount
  }, []);

  return (
    <WebSocketContext.Provider value={{ location }}>
      {children}
    </WebSocketContext.Provider>
  );
};
