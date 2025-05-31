// App.tsx or StreamProvider.tsx
import { useEffect } from 'react';
import { useStreamStore } from '@/store/streamStore';

export const StreamProvider = () => {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/stream');

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      useStreamStore.getState().addEvent({
        id: data.id,
        type: data.type,
        timestamp: Date.now(),
        payload: data.payload,
      });
    };

    return () => ws.close();
  }, []);

  return null; // You can return a loader or nothing
};
