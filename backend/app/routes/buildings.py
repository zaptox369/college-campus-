from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Building, Room
from app.schemas import BuildingOut, BuildingCreate

router = APIRouter(prefix="/buildings", tags=["Buildings"])

@router.get("", response_model=List[BuildingOut])
def get_all_buildings(db: Session = Depends(get_db)):
    return db.query(Building).all()

@router.get("/{building_id}", response_model=BuildingOut)
def get_building(building_id: int, db: Session = Depends(get_db)):
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    return building

@router.post("", response_model=BuildingOut)
def create_building(building: BuildingCreate, db: Session = Depends(get_db)):
    db_b = Building(**building.dict())
    db.add(db_b)
    db.commit()
    db.refresh(db_b)
    return db_b

@router.get("/{building_id}/rooms")
def get_building_rooms(building_id: int, db: Session = Depends(get_db)):
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    rooms = db.query(Room).filter(Room.building_id == building_id).all()
    
    total_capacity = sum(r.capacity for r in rooms)
    total_occ = sum(r.current_occupancy for r in rooms)
    overall_pct = (total_occ / max(1, total_capacity)) * 100

    return {
        "building": building,
        "total_rooms": len(rooms),
        "total_capacity": total_capacity,
        "current_occupancy": total_occ,
        "occupancy_percentage": round(overall_pct, 1),
        "rooms": rooms
    }
