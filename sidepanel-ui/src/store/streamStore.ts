// store/streamStore.ts
import { create } from 'zustand';
import { BaseEvent } from '@/types/Event';

// Define the shape of your store
interface StreamStore {
    events: BaseEvent[];
    addEvent: (event: BaseEvent) => void;
}

// Create the Zustand store
export const useStreamStore = create<StreamStore>((set) => ({
    events: [],
    addEvent: (event) =>
        set((state) => ({
            events: [...state.events, event],
        })),
    clearEvents: () => set({ events: [] }),
    removeEvent: (id: string) =>
        set((state) => ({
            events: state.events.filter((e) => e.id !== id),
        })),
}));
