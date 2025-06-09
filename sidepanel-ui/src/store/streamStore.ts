// store/streamStore.ts
import { create } from 'zustand';
import { BaseEvent, MouseEventData } from '@/types/Event';
import AppConfig from '@/config/config';
import { websocketService } from '@/websocket/service';
type PageData = {
    url: string | null;
    title: string | null;
    boundingBoxes: {
        tag: string;
        className: string;
        text: string;
        boundingBox: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    }[];
    screenshotImageBase64: string | null;
};
// Define the shape of your store
interface StreamStore {
    page: PageData;
    events: BaseEvent[];
    mouseEvents: any[]; // Add mouseEvents array to store mouse events
    addEvent: (event: BaseEvent) => void;
}



// Create the Zustand store
export const useStreamStore = create<StreamStore>((set) => ({
    page: {
        url: null,
        title: null,
        boundingBoxes: [],
        screenshotImageBase64: null,
    },
    events: [],
    mouseEvents: [], // Add mouseEvents array to store mouse events
    addEvent: (event) =>
        set((state) => ({
            events: [...state.events, event],
        })),
    addMouseEvent: (mouseEvent: MouseEventData) =>
        set((state) => ({
            events: [...state.events, mouseEvent as BaseEvent],
        })), // Add method to add mouse events
    clearMouseEvents: () => set({ events: [] }), // Add method to clear mouse events
    clearEvents: () => set({ events: [] }),
    removeEvent: (id: string) =>
        set((state) => ({
            events: state.events.filter((e) => e.id !== id),
        })),

}));

// Subscribe to state changes and log them
useStreamStore.subscribe((state) => {
    console.log('StreamStore state changed:', state);
    
});