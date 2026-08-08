from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    floors = Column(Integer, default=3)
    category = Column(String, default="academic")  # academic, library, admin, sports, dining

    rooms = relationship("Room", back_populates="building", cascade="all, delete-orphan")
