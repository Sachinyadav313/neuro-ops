from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from kafka import KafkaConsumer
import json
import asyncio
import os
from contextlib import asynccontextmanager

# 1. Configuration - Use Docker service name
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
ALERTS_TOPIC = "neuro_ops_alerts"

recent_alerts = []

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try: await connection.send_json(message)
            except: pass

manager = ConnectionManager()

async def consume_alerts():
    print(f"🎧 API Listener started on {KAFKA_BOOTSTRAP_SERVERS}")
    consumer = KafkaConsumer(
        ALERTS_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_deserializer=lambda x: json.loads(x.decode('utf-8')),
        auto_offset_reset='latest'
    )
    for message in consumer:
        data = message.value
        recent_alerts.insert(0, data)
        if len(recent_alerts) > 20: recent_alerts.pop()
        await manager.broadcast(data)
        await asyncio.sleep(0.01)

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(consume_alerts())
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/alerts")
async def get_alerts():
    return recent_alerts

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True: await websocket.receive_text()
    except WebSocketDisconnect: manager.disconnect(websocket)