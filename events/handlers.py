from fastapi import WebSocket
from datetime import datetime
from models.events import ChatEvent, NotificationEvent, SystemEvent, UserEvent, PingEvent

async def handle_chat_event(ws: WebSocket, event: ChatEvent):
    print(f"[Chat] {event.payload.sender}: {event.payload.message}")
    await ws.send_text(f"Chat message received from {event.payload.sender}")

async def handle_notification_event(ws: WebSocket, event: NotificationEvent):
    print(f"[Notification] {event.payload.title} - {event.payload.body}")
    await ws.send_text(f"Notification: {event.payload.title}")

async def handle_system_event(ws: WebSocket, event: SystemEvent):
    print(f"[System] Event: {event.payload.event}")
    await ws.send_text(f"System status: {event.payload.event}")

async def handle_user_event(ws: WebSocket, event: UserEvent):
    print(f"[User Action] {event.payload.action}")
    await ws.send_text(f"User action received: {event.payload.action}")

async def handle_ping_event(ws: WebSocket, event: PingEvent):
    print("[Ping] Ping received, responding with Pong")
    pong_event = {
        "id": event.id,
        "type": "pong",
        "timestamp": "",
        "payload": None
    }
    await ws.send_json(pong_event)
