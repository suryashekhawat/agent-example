import { useEffect } from 'react';
import { websocketService } from '@/websocket/service';
import AppConfig from '@/config/config';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  useEffect(() => {
    websocketService.connect(AppConfig.WebSocket.url);

    return () => {
      websocketService.disconnect();
    };
  }, []);

  return (<>{children}</>);
};