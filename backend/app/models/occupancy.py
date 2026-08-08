from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class OccupancyLog(Base):
    __tablename__ = "occupancy_logs"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    current_count = Column(Integer, nullable=False)
    capacity = Column(Integer, nullable=False)
    crowd_level = Column(String, nullable=False)  # Low, Medium, High, Very High
    occupancy_percentage = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    room = relationship("Room", back_populates="occupancy_logs")
