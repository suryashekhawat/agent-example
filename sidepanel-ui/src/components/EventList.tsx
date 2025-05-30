// components/EventList.tsx
import { useStreamStore } from '@/store/streamStore';

export const EventList = () => {
  const events = useStreamStore((state) => state.events);

  return (
    <div className="p-4 space-y-2">
      {events.map((event) => (
        <div key={event.id} className="p-3 border rounded">
          <strong>{event.type.toUpperCase()}</strong>
          <div>{JSON.stringify(event.payload)}</div>
          <small>{new Date(event.timestamp).toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  );
};
