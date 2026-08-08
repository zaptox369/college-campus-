from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Event, Building
from app.schemas import EventOut, EventCreate

router = APIRouter(prefix="/events", tags=["Events"])

@router.get("", response_model=List[EventOut])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.start_time.asc()).all()

@router.post("", response_model=EventOut)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_e = Event(**event.dict())
    db.add(db_e)
    db.commit()
    db.refresh(db_e)
    return db_e

@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}
