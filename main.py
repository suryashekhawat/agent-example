import os

import uvicorn
from fastapi import FastAPI, WebSocketDisconnect, WebSocket
from google.adk.cli.fast_api import get_fast_api_app
from fastapi.middleware.cors import CORSMiddleware
from models.events import Event, ChatEvent, NotificationEvent, SystemEvent, UserEvent
from pydantic import TypeAdapter, ValidationError
from models.events import Event, ChatEvent, NotificationEvent, SystemEvent, UserEvent
from events.handlers import (
    handle_chat_event,
    handle_notification_event,
    handle_system_event,
    handle_user_event,
)

event_adapter = TypeAdapter(Event)
EVENT_HANDLERS = {
    'chat': handle_chat_event,
    'notification': handle_notification_event,
    'system': handle_system_event,
    'user': handle_user_event,
}

AGENT_DIR = os.path.dirname(os.path.abspath(__file__))
SESSION_DB_URL = "sqlite:///./sessions.db"
ALLOWED_ORIGINS = ["http://localhost", "http://localhost:8080", "*"]
SERVE_WEB_INTERFACE = False

app: FastAPI = get_fast_api_app(
    agents_dir=AGENT_DIR,
    session_db_url=SESSION_DB_URL,
    allow_origins=ALLOWED_ORIGINS,
    web=SERVE_WEB_INTERFACE,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "ok"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("WebSocket connection established")

    try:
        while True:
            data = await websocket.receive_json()

            try:
                event = event_adapter.validate_python(data)
                print(f"Received event: {event}")
                handler = EVENT_HANDLERS.get(event.type)
                if handler:
                    await handler(websocket, event)
            except ValidationError as ve:
                await websocket.send_text(f"Validation error: {ve}")

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close(code=1011)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))