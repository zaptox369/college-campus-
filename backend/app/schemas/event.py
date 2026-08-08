from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    building_id: Optional[int] = None
    location_name: str
    organizer: str
    category: str = "Academic"
    start_time: datetime
    end_time: datetime

class EventCreate(EventBase):
    pass

class EventOut(EventBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
