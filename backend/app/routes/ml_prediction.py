from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Room, Building
from app.ml.crowd_predictor import crowd_predictor

router = APIRouter(prefix="/predictions", tags=["ML Predictions"])

@router.get("/room/{room_id}")
def predict_room_crowd(
    room_id: int, 
    minutes: int = Query(default=30, ge=5, le=180),
    db: Session = Depends(get_db)
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    building = db.query(Building).filter(Building.id == room.building_id).first()

    pred = crowd_predictor.predict_future_occupancy(
        room_type=room.room_type,
        capacity=room.capacity,
        current_occupancy=room.current_occupancy,
        minutes_ahead=minutes
    )

    return {
        "room_id": room.id,
        "room_number": room.room_number,
        "room_name": room.name,
        "building_name": building.name if building else "Unknown",
        "current_occupancy": room.current_occupancy,
        "capacity": room.capacity,
        "current_crowd_level": room.crowd_level,
        "forecast": pred
    }

@router.get("/all")
def predict_all_rooms(
    minutes: int = Query(default=30, ge=5, le=180),
    db: Session = Depends(get_db)
):
    rooms = db.query(Room).all()
    results = []
    
    for r in rooms:
        b = db.query(Building).filter(Building.id == r.building_id).first()
        pred = crowd_predictor.predict_future_occupancy(
            room_type=r.room_type,
            capacity=r.capacity,
            current_occupancy=r.current_occupancy,
            minutes_ahead=minutes
        )
        results.append({
            "room_id": r.id,
            "room_number": r.room_number,
            "name": r.name,
            "building_code": b.code if b else "",
            "building_name": b.name if b else "Unknown",
            "capacity": r.capacity,
            "current_occupancy": r.current_occupancy,
            "current_crowd_level": r.crowd_level,
            "predicted_occupancy": pred["predicted_occupancy"],
            "predicted_percentage": pred["predicted_percentage"],
            "predicted_crowd_level": pred["predicted_crowd_level"],
            "recommendation": pred["recommendation"]
        })

    return {
        "minutes_ahead": minutes,
        "total_rooms_forecasted": len(results),
        "forecasts": results
    }
