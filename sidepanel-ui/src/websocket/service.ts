import { useStreamStore } from '@/store/streamStore';
import { BaseEventType, DefaultEvent } from '@/types/Event';
import { WebSocketEvent } from '@/types/Websocket';



class WebSocketService {
  private ws: WebSocket | null = null;

  connect(url: string): void {
    if (this.ws) return; // Prevent multiple connections

    this.ws = new WebSocket(url);

    this.ws.onopen = (): void => {
      console.log('WebSocket connected main');
    };

    this.ws.onmessage = (event: MessageEvent): void => {
      const data: WebSocketEvent = JSON.parse(event.data);

      // Validate/parse the event and add it to the store
      useStreamStore.getState().addEvent({
        id: data.id,
        type: data.type as BaseEventType,
        timestamp: Date.now(),
        payload: data.payload,
      });
    };

    this.ws.onerror = (e: Event): void => {
      console.error('WebSocket error:', e);
    };

    this.ws.onclose = (): void => {
      console.log('WebSocket disconnected');
      this.ws = null; // Reset the connection
    };
  }
  onopen(): void {
  
  }

  onmessage(event: MessageEvent): void {
  
  }
  sendMessage(message: DefaultEvent): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketService = new WebSocketService();