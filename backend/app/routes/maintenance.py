from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import MaintenanceReport
from app.schemas import MaintenanceOut, MaintenanceCreate, MaintenanceUpdateStatus

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.get("", response_model=List[MaintenanceOut])
def get_maintenance_reports(db: Session = Depends(get_db)):
    return db.query(MaintenanceReport).order_by(MaintenanceReport.created_at.desc()).all()

@router.post("", response_model=MaintenanceOut)
def create_maintenance_report(report: MaintenanceCreate, db: Session = Depends(get_db)):
    db_rep = MaintenanceReport(**report.dict())
    db.add(db_rep)
    db.commit()
    db.refresh(db_rep)
    return db_rep

@router.patch("/{report_id}/status", response_model=MaintenanceOut)
def update_maintenance_status(
    report_id: int, 
    update: MaintenanceUpdateStatus, 
    db: Session = Depends(get_db)
):
    report = db.query(MaintenanceReport).filter(MaintenanceReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Maintenance report not found")
    
    report.status = update.status
    report.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(report)
    return report
