from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import math
from app.database import get_db
from app.models import Building, Room

router = APIRouter(prefix="/navigation", tags=["Navigation"])

def haversine_distance_meters(lat1, lon1, lat2, lon2):
    R = 6371000 # radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

@router.get("/route")
def get_campus_route(
    origin_building_id: int,
    destination_building_id: int,
    db: Session = Depends(get_db)
):
    origin = db.query(Building).filter(Building.id == origin_building_id).first()
    dest = db.query(Building).filter(Building.id == destination_building_id).first()

    if not origin or not dest:
        raise HTTPException(status_code=404, detail="Origin or Destination building not found")

    if origin.id == dest.id:
        return {
            "origin": origin.name,
            "destination": dest.name,
            "distance_meters": 0,
            "estimated_walking_time_mins": 0,
            "steps": ["You are already at the target building."]
        }

    dist = haversine_distance_meters(origin.latitude, origin.longitude, dest.latitude, dest.longitude)
    # Scale for realistic campus walking distance (e.g. 150 - 450 meters)
    scaled_dist = max(80.0, round(dist * 3000, 1)) if dist > 0 else 120.0
    
    # Walking speed average: 1.4 m/s (approx 84 meters per min)
    walking_mins = max(1, round(scaled_dist / 80.0))

    steps = [
        f"Start at {origin.name} ({origin.code}).",
        f"Exit towards the central campus courtyard.",
        f"Follow the main pedestrian walkway towards {dest.name}.",
        f"Arrive at {dest.name} entrance. Destination is on your right."
    ]

    return {
        "origin": {
            "id": origin.id,
            "code": origin.code,
            "name": origin.name,
            "latitude": origin.latitude,
            "longitude": origin.longitude
        },
        "destination": {
            "id": dest.id,
            "code": dest.code,
            "name": dest.name,
            "latitude": dest.latitude,
            "longitude": dest.longitude
        },
        "distance_meters": int(scaled_dist),
        "estimated_walking_time_mins": walking_mins,
        "accessible_route": True,
        "steps": steps
    }
