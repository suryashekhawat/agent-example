// utils/socket.ts
import { useStreamStore } from '@/store/streamStore';

const ws = new WebSocket('ws://localhost:8000/stream');

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);

  // You should validate/parse this into a BaseEvent
  const event = {
    id: data.id,
    type: data.type,
    timestamp: Date.now(),
    payload: data.payload,
  };

  useStreamStore.getState().addEvent(event);
};
