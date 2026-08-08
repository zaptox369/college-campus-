from pydantic import BaseModel
from typing import Optional, List

class BuildingBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    floors: int = 3
    category: str = "academic"

class BuildingCreate(BuildingBase):
    pass

class BuildingOut(BuildingBase):
    id: int

    class Config:
        from_attributes = True
