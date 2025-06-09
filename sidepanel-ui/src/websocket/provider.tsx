import AppConfig from '@/config/config';
import { useEffect } from 'react';
import { websocketService } from './service';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  useEffect(() => {
    
    console.log('Connecting WebSocket to:', AppConfig.WebSocket.url);
    websocketService.connect(AppConfig.WebSocket.url);

    // Heartbeat mechanism
    const interval = setInterval(() => {
      const ws = websocketService.getWebSocket();
      if (ws && ws.readyState === WebSocket.OPEN) {
        websocketService.sendMessage({
          id: 'heartbeat',
          type: 'ping',
          timestamp: Date.now(),
          payload: null
          });
      }
    }, 5000); // Send heartbeat every 5 seconds

    return () => {
      console.log('WebSocketProvider: Disconnecting WebSocket');
      clearInterval(interval); 
      websocketService.disconnect();
    };
    
  }, []);

  return (<>{children}</>);
};