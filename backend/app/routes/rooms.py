from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models import Room, Building, OccupancyLog
from app.schemas import RoomOut, RoomCreate, RoomUpdateOccupancy
from app.routes.websockets import manager

router = APIRouter(prefix="/rooms", tags=["Rooms"])

def get_crowd_level(current: int, capacity: int) -> str:
    pct = current / max(1, capacity)
    if pct < 0.4: return "Low"
    if pct < 0.7: return "Medium"
    if pct < 0.9: return "High"
    return "Very High"

@router.get("")
def get_rooms(
    building_id: Optional[int] = None,
    room_type: Optional[str] = None,
    floor: Optional[int] = None,
    status: Optional[str] = None,
    available_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Room)
    
    if building_id:
        query = query.filter(Room.building_id == building_id)
    if room_type:
        query = query.filter(Room.room_type.ilike(f"%{room_type}%"))
    if floor:
        query = query.filter(Room.floor == floor)
    if status:
        query = query.filter(Room.status == status)
    if available_only:
        query = query.filter(Room.status == "available")

    rooms = query.all()

    # Join building names
    result = []
    for r in rooms:
        b = db.query(Building).filter(Building.id == r.building_id).first()
        r_dict = {
            "id": r.id,
            "building_id": r.building_id,
            "building_name": b.name if b else "Unknown",
            "building_code": b.code if b else "",
            "room_number": r.room_number,
            "name": r.name,
            "room_type": r.room_type,
            "capacity": r.capacity,
            "current_occupancy": r.current_occupancy,
            "occupancy_pct": round((r.current_occupancy / max(1, r.capacity)) * 100, 1),
            "floor": r.floor,
            "status": r.status,
            "crowd_level": r.crowd_level,
            "updated_at": r.updated_at
        }
        result.append(r_dict)
    
    return result

@router.get("/{room_id}")
def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    b = db.query(Building).filter(Building.id == room.building_id).first()
    return {
        "id": room.id,
        "building_id": room.building_id,
        "building_name": b.name if b else "Unknown",
        "building_code": b.code if b else "",
        "room_number": room.room_number,
        "name": room.name,
        "room_type": room.room_type,
        "capacity": room.capacity,
        "current_occupancy": room.current_occupancy,
        "occupancy_pct": round((room.current_occupancy / max(1, room.capacity)) * 100, 1),
        "floor": room.floor,
        "status": room.status,
        "crowd_level": room.crowd_level,
        "updated_at": room.updated_at
    }

@router.put("/{room_id}/occupancy")
async def update_room_occupancy(
    room_id: int, 
    update: RoomUpdateOccupancy, 
    db: Session = Depends(get_db)
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    new_occ = min(room.capacity, max(0, update.current_occupancy))
    room.current_occupancy = new_occ
    room.crowd_level = get_crowd_level(new_occ, room.capacity)
    
    if update.status:
        room.status = update.status
    elif room.status != "maintenance":
        room.status = "occupied" if new_occ >= room.capacity else "available"

    db.commit()
    db.refresh(room)

    # Log to OccupancyLog
    pct = (room.current_occupancy / max(1, room.capacity)) * 100
    log = OccupancyLog(
        room_id=room.id,
        current_count=room.current_occupancy,
        capacity=room.capacity,
        crowd_level=room.crowd_level,
        occupancy_percentage=round(pct, 1),
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()

    # Broadcast real-time update via WebSocket
    b = db.query(Building).filter(Building.id == room.building_id).first()
    ws_payload = {
        "type": "ROOM_UPDATE",
        "room_id": room.id,
        "building_id": room.building_id,
        "building_code": b.code if b else "",
        "room_number": room.room_number,
        "current_occupancy": room.current_occupancy,
        "capacity": room.capacity,
        "occupancy_pct": round(pct, 1),
        "crowd_level": room.crowd_level,
        "status": room.status,
        "timestamp": datetime.utcnow().isoformat()
    }
    await manager.broadcast(ws_payload)

    return room
