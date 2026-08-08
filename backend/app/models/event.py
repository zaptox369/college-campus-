from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=True)
    location_name = Column(String, nullable=False)
    organizer = Column(String, nullable=False)
    category = Column(String, default="Academic")  # Academic, Workshop, Cultural, Sports, Seminar
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
