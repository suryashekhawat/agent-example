import { useEffect } from 'react';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  useEffect(() => {
    
  }, []);

  return (<>{children}</>);
};