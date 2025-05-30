// types/Event.ts
export type BaseEventType = 'chat' | 'notification' | 'system' | 'user';

export interface BaseEvent {
  id: string;
  type: BaseEventType;
  timestamp: number;
  payload: unknown;
}
