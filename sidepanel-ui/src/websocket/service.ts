class WebSocketService {
  private ws: WebSocket | null = null;

  connect(url: string): void {
    if (this.ws) {
      console.log('WebSocket already connected');
      return; // Prevent multiple connections
    } else {
      this.ws = new WebSocket(url);
    }

    this.ws.onopen = (): void => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event): void => {
      console.log('ws:received: ', event.data);
    };

    this.ws.onerror = (e: Event): void => {
      console.error('WebSocket error:', e);
      this.retryConnection(url);
    };

    this.ws.onclose = (): void => {
      console.log('WebSocket disconnected');
      this.ws = null; // Reset the connection
    };
  }
  onopen(): void {
    console.log('WebSocket connection opened');
  }
  getWebSocket(): WebSocket | null {
    return this.ws;
  }
  onmessage(event: MessageEvent): void {
    const data: Record<string, unknown> = JSON.parse(event.data);
    console.log('Received message:', data);
  }
  stringifyMessage(message: Record<string, unknown>): string {
    try {
      return JSON.stringify(message);
    } catch (error) {
      console.error('Error stringifying message:', error);
      return '';
    }
  }
  sendMessage(message: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const stringifiedMessage = this.stringifyMessage(message);
      console.log("ws:sent:", stringifiedMessage);
      this.ws.send(stringifiedMessage);
    } else {
      console.error('WebSocket is not connected');
    }
  }

  retryConnection(url: string): void {
    console.log('Retrying WebSocket connection...');
    setTimeout(() => this.connect(url), 5000); // Retry after 5 seconds
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketService = new WebSocketService();