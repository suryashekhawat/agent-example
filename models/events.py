from typing import Literal, Union, Optional, Any
from pydantic import BaseModel


class BaseEvent(BaseModel):
    id: str
    type: Literal['chat', 'notification', 'system', 'user']
    timestamp: int
    payload: dict


# Specialized events
class ChatPayload(BaseModel):
    sender: Literal['user', 'bot']
    message: str
    messageId: Optional[str]
    conversationId: Optional[str]

class NotificationPayload(BaseModel):
    title: str
    body: str
    level: Literal['info', 'warning', 'error']

class SystemPayload(BaseModel):
    event: Literal['typing', 'stop_typing', 'connected', 'disconnected']
    userId: Optional[str]

class UserPayload(BaseModel):
    action: str
    metadata: Optional[dict[str, Any]]


# Union of all event types
class ChatEvent(BaseEvent):
    type: Literal['chat']
    payload: ChatPayload

class NotificationEvent(BaseEvent):
    type: Literal['notification']
    payload: NotificationPayload

class SystemEvent(BaseEvent):
    type: Literal['system']
    payload: SystemPayload

class UserEvent(BaseEvent):
    type: Literal['user']
    payload: UserPayload

Event = Union[ChatEvent, NotificationEvent, SystemEvent, UserEvent]
