from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RoomBase(BaseModel):
    building_id: int
    room_number: str
    name: Optional[str] = None
    room_type: str = "classroom"
    capacity: int = 30
    current_occupancy: int = 0
    floor: int = 1
    status: str = "available"
    crowd_level: str = "Low"

class RoomCreate(RoomBase):
    pass

class RoomUpdateOccupancy(BaseModel):
    current_occupancy: int
    status: Optional[str] = None

class RoomOut(RoomBase):
    id: int
    updated_at: datetime
    building_name: Optional[str] = None

    class Config:
        from_attributes = True
