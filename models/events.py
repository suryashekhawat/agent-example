from typing import Annotated, Literal, Union, Optional, Any
from pydantic import BaseModel, Field


class BaseEvent(BaseModel):
    id: str
    type: Literal['chat', 'notification', 'system', 'user', 'ping']
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

class PongPayload(BaseModel):
    status: Literal["ok"] = "ok"

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

class PingEvent(BaseEvent):
    type: Literal['ping']
    payload: None  # No payload for ping events



class PongEvent(BaseModel):
    type: Literal["pong"]
    payload: PongPayload

Event = Annotated[
    Union[ChatEvent, NotificationEvent, SystemEvent, UserEvent, PingEvent],
    Field(discriminator='type')
]