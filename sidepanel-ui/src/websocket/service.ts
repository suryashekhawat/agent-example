import { DefaultEvent } from '@/types/Event';



class WebSocketService {
  private ws: WebSocket | null = null;

  connect(url: string): void {
    if (this.ws) return; // Prevent multiple connections

    this.ws = new WebSocket(url);

    this.ws.onopen = (): void => {
      console.log('WebSocket connected main');
    };

    this.ws.onmessage = (event): void => {};

    this.ws.onerror = (e: Event): void => {
      console.error('WebSocket error:', e);
    };

    this.ws.onclose = (): void => {
      console.log('WebSocket disconnected');
      this.ws = null; // Reset the connection
    };
  }
  onopen(): void {}

  onmessage(event: MessageEvent): void {}
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