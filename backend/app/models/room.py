from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    room_number = Column(String, nullable=False, index=True)
    name = Column(String, nullable=True)
    room_type = Column(String, default="classroom")  # classroom, lab, library, auditorium, office, cafe
    capacity = Column(Integer, nullable=False, default=30)
    current_occupancy = Column(Integer, default=0)
    floor = Column(Integer, default=1)
    status = Column(String, default="available")  # available, occupied, maintenance, reserved
    crowd_level = Column(String, default="Low")    # Low, Medium, High, Very High
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    building = relationship("Building", back_populates="rooms")
    occupancy_logs = relationship("OccupancyLog", back_populates="room", cascade="all, delete-orphan")
