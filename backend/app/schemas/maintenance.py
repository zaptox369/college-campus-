from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MaintenanceBase(BaseModel):
    location: str
    title: str
    description: str
    priority: str = "Medium"

class MaintenanceCreate(MaintenanceBase):
    user_name: Optional[str] = "Anonymous Student"

class MaintenanceUpdateStatus(BaseModel):
    status: str

class MaintenanceOut(MaintenanceBase):
    id: int
    user_name: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
