// types/Event.ts
export type BaseEventType = 'chat' | 'notification' | 'system' | 'user' | 'extension' | 'mousemove' | 'click' | 'streamStateUpdate';
export type DefaultEvent = ChatEvent | NotificationEvent | SystemEvent | UserEvent | ExtensionEvent | StreamStateUpdateEvent;

export interface BaseEvent {
    id?: string;
    type: BaseEventType;
    timestamp: number;
    payload: unknown;
}

export interface MouseEventData extends BaseEvent {
    type: 'mousemove' | 'click';
    x: number;
    y: number;
    timestamp: number;
    element?: string; // Optional for click events
}
export interface ChatEvent extends BaseEvent {
    type: 'chat';
    payload: {
        sender: 'user' | 'bot';
        message: string;
        messageId?: string;
        conversationId?: string;
    };
}

export interface NotificationEvent extends BaseEvent {
    type: 'notification';
    payload: {
        title: string;
        body: string;
        level: 'info' | 'warning' | 'error';
    };
}

export interface SystemEvent extends BaseEvent {
    type: 'system';
    payload: {
        event: 'typing' | 'stop_typing' | 'connected' | 'disconnected';
        userId?: string;
    };
}

export interface UserEvent extends BaseEvent {
    type: 'user';
    payload: {
        action: string;
        metadata?: Record<string, any>;
    };
}

export interface ExtensionEvent extends BaseEvent {
    type: 'extension';
    payload: {
        extensionId: string;
        data: Record<string, any>;
    };
}


interface StreamStateUpdateEvent extends BaseEvent {
    type: 'streamStateUpdate';
    payload: any; // Adjust the payload type as needed
}