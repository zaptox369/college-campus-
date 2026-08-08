from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base

class MaintenanceReport(Base):
    __tablename__ = "maintenance_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, default="Anonymous Student")
    location = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String, default="Medium")  # Low, Medium, High
    status = Column(String, default="Reported") # Reported, Assigned, In Progress, Resolved
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
