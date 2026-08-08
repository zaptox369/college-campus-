from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Room, Building, MaintenanceReport, Event, OccupancyLog

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    buildings = db.query(Building).all()
    rooms = db.query(Room).all()
    events = db.query(Event).all()
    maintenance = db.query(MaintenanceReport).all()

    total_buildings = len(buildings)
    total_rooms = len(rooms)
    available_rooms = sum(1 for r in rooms if r.status == "available")
    occupied_rooms = sum(1 for r in rooms if r.status == "occupied")
    maintenance_rooms = sum(1 for r in rooms if r.status == "maintenance")

    total_capacity = sum(r.capacity for r in rooms)
    current_occupancy = sum(r.current_occupancy for r in rooms)
    campus_occupancy_pct = round((current_occupancy / max(1, total_capacity)) * 100, 1)

    # Crowd distribution breakdown
    crowd_counts = {
        "Low": sum(1 for r in rooms if r.crowd_level == "Low"),
        "Medium": sum(1 for r in rooms if r.crowd_level == "Medium"),
        "High": sum(1 for r in rooms if r.crowd_level == "High"),
        "Very High": sum(1 for r in rooms if r.crowd_level == "Very High")
    }

    # Building occupancy breakdown
    building_analytics = []
    for b in buildings:
        b_rooms = [r for r in rooms if r.building_id == b.id]
        b_cap = sum(r.capacity for r in b_rooms)
        b_occ = sum(r.current_occupancy for r in b_rooms)
        b_pct = round((b_occ / max(1, b_cap)) * 100, 1) if b_cap > 0 else 0
        building_analytics.append({
            "building_id": b.id,
            "code": b.code,
            "name": b.name,
            "category": b.category,
            "room_count": len(b_rooms),
            "total_capacity": b_cap,
            "current_occupancy": b_occ,
            "occupancy_pct": b_pct
        })

    # Simulated Peak Hours distribution (8 AM - 8 PM)
    peak_hours_data = [
        {"hour": "08:00 AM", "occupancy_pct": 25},
        {"hour": "09:00 AM", "occupancy_pct": 55},
        {"hour": "10:00 AM", "occupancy_pct": 78},
        {"hour": "11:00 AM", "occupancy_pct": 88},
        {"hour": "12:00 PM", "occupancy_pct": 82},
        {"hour": "01:00 PM", "occupancy_pct": 65},
        {"hour": "02:00 PM", "occupancy_pct": 79},
        {"hour": "03:00 PM", "occupancy_pct": 74},
        {"hour": "04:00 PM", "occupancy_pct": 60},
        {"hour": "05:00 PM", "occupancy_pct": 45},
        {"hour": "06:00 PM", "occupancy_pct": 30},
        {"hour": "07:00 PM", "occupancy_pct": 18},
    ]

    return {
        "kpis": {
            "total_buildings": total_buildings,
            "total_rooms": total_rooms,
            "available_rooms": available_rooms,
            "occupied_rooms": occupied_rooms,
            "maintenance_rooms": maintenance_rooms,
            "total_capacity": total_capacity,
            "current_occupancy": current_occupancy,
            "campus_occupancy_pct": campus_occupancy_pct,
            "active_events": len(events),
            "open_maintenance_reports": sum(1 for m in maintenance if m.status != "Resolved")
        },
        "crowd_counts": crowd_counts,
        "building_analytics": building_analytics,
        "peak_hours_data": peak_hours_data
    }
