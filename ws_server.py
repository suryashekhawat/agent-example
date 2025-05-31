# ws_server.py
import asyncio
import websockets
import json
import uuid
import time

async def handler(websocket, path):
    print("Client connected")
    try:
        while True:
            # Simulated event payload
            event = {
                "id": str(uuid.uuid4()),
                "type": "chat",
                "timestamp": int(time.time() * 1000),
                "payload": {
                    "userId": "123",
                    "message": "Hello from server"
                }
            }
            await websocket.send(json.dumps(event))
            await asyncio.sleep(2)  # send every 2 seconds
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8000):
        print("WebSocket server started on ws://localhost:8000/stream")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
