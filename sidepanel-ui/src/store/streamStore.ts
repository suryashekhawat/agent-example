// store/streamStore.ts
import { create } from 'zustand';
import { BaseEvent } from '@/types/Event';
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


// Subscribe to state changes and log them
useStreamStore.subscribe((state) => {
    console.log('StreamStore state updated:', state);
});