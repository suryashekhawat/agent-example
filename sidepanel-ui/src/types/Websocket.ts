export interface WebSocketEvent {
  id: string;
  type: string;
  timestamp: number;
  payload: any;
}

export interface WebSocketService {
  connect(url: string): void;
  sendMessage(message: any): void;
  disconnect(): void;
}