from pydantic import BaseModel
from datetime import datetime

class OccupancyLogOut(BaseModel):
    id: int
    room_id: int
    current_count: int
    capacity: int
    crowd_level: str
    occupancy_percentage: float
    timestamp: datetime

    class Config:
        from_attributes = True
