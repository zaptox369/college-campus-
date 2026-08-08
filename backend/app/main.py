from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, buildings, rooms, events, maintenance, websockets, analytics, ml_prediction, navigation

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Digital Twin Campus API",
    description="REST & WebSocket APIs for Real-time Digital Twin of College Campus with ML Crowd Prediction",
    version="1.0.0"
)

# CORS Middleware setup to allow Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router registration
app.include_router(auth.router)
app.include_router(buildings.router)
app.include_router(rooms.router)
app.include_router(events.router)
app.include_router(maintenance.router)
app.include_router(analytics.router)
app.include_router(ml_prediction.router)
app.include_router(navigation.router)
app.include_router(websockets.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Welcome to the Digital Twin Campus API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }
