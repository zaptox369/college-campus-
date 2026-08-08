from datetime import datetime, timedelta
from app.database import SessionLocal, engine, Base
from app.models import Building, Room, User, Event, MaintenanceReport, OccupancyLog

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data if any
    db.query(OccupancyLog).delete()
    db.query(MaintenanceReport).delete()
    db.query(Event).delete()
    db.query(Room).delete()
    db.query(Building).delete()
    db.query(User).delete()
    db.commit()

    print("Seeding database with campus digital twin data...")

    # 1. Buildings
    buildings = [
        Building(code="ACAD_A", name="Academic Block A", description="Primary lecture halls, engineering classrooms, and faculty offices.", latitude=12.9716, longitude=77.5946, floors=4, category="academic"),
        Building(code="ACAD_B", name="Academic Block B", description="Humanities, mathematics department, and seminar halls.", latitude=12.9720, longitude=77.5950, floors=3, category="academic"),
        Building(code="LIB", name="Central Library", description="Multi-story digital and print resource library with quiet study pods.", latitude=12.9710, longitude=77.5940, floors=3, category="library"),
        Building(code="SC_CAFE", name="Student Union & Cafeteria", description="Dining court, student lounge, and campus merchandise store.", latitude=12.9725, longitude=77.5935, floors=2, category="dining"),
        Building(code="LAB_HUB", name="Innovation & Tech Labs", description="Advanced Computer Science, Robotics, and AI research labs.", latitude=12.9705, longitude=77.5955, floors=3, category="academic"),
        Building(code="AUD", name="Grand Auditorium", description="500-seat multi-purpose hall for cultural events, convocations, and fests.", latitude=12.9730, longitude=77.5942, floors=2, category="admin"),
        Building(code="SPORTS", name="Sports Complex", description="Indoor basketball court, badminton, gymnasium, and swimming pool.", latitude=12.9698, longitude=77.5960, floors=2, category="sports")
    ]
    db.add_all(buildings)
    db.commit()

    # Query back buildings to get IDs
    b_map = {b.code: b for b in db.query(Building).all()}

    # Helper function for crowd level
    def get_crowd(curr, cap):
        pct = curr / max(1, cap)
        if pct < 0.4: return "Low"
        if pct < 0.7: return "Medium"
        if pct < 0.9: return "High"
        return "Very High"

    # 2. Rooms
    rooms_data = [
        # Academic Block A
        (b_map["ACAD_A"].id, "A101", "Lecture Hall 1", "classroom", 60, 42, 1, "occupied"),
        (b_map["ACAD_A"].id, "A102", "Smart Classroom 2", "classroom", 40, 12, 1, "available"),
        (b_map["ACAD_A"].id, "A201", "Physics Lab", "lab", 35, 30, 2, "occupied"),
        (b_map["ACAD_A"].id, "A202", "Electronics Lab", "lab", 30, 0, 2, "available"),
        (b_map["ACAD_A"].id, "A301", "Seminar Room A", "classroom", 80, 75, 3, "occupied"),
        (b_map["ACAD_A"].id, "A401", "Faculty Conference Room", "office", 25, 5, 4, "available"),

        # Academic Block B
        (b_map["ACAD_B"].id, "B101", "Math Lecture Room", "classroom", 50, 18, 1, "available"),
        (b_map["ACAD_B"].id, "B102", "Statistics Lab", "lab", 40, 38, 1, "occupied"),
        (b_map["ACAD_B"].id, "B201", "Humanities Workshop", "classroom", 45, 0, 2, "available"),
        (b_map["ACAD_B"].id, "B301", "Dean Conference Room", "office", 20, 8, 3, "available"),

        # Central Library
        (b_map["LIB"].id, "L101", "Silent Reading Zone", "library", 100, 82, 1, "occupied"),
        (b_map["LIB"].id, "L201", "Group Study Hub", "library", 60, 45, 2, "occupied"),
        (b_map["LIB"].id, "L301", "Digital Media Archive", "library", 40, 10, 3, "available"),

        # Cafeteria
        (b_map["SC_CAFE"].id, "C101", "Main Dining Court", "cafe", 150, 135, 1, "occupied"),
        (b_map["SC_CAFE"].id, "C102", "Coffee Lounge & Bookstore", "cafe", 50, 28, 1, "available"),
        (b_map["SC_CAFE"].id, "C201", "Student Council Lounge", "office", 30, 15, 2, "available"),

        # Innovation & Tech Labs
        (b_map["LAB_HUB"].id, "H101", "AI & Data Science Lab", "lab", 45, 41, 1, "occupied"),
        (b_map["LAB_HUB"].id, "H102", "Robotics & IoT Lab", "lab", 35, 20, 1, "available"),
        (b_map["LAB_HUB"].id, "H201", "Cybersecurity Sandbox", "lab", 40, 35, 2, "occupied"),
        (b_map["LAB_HUB"].id, "H301", "Cloud Computing Center", "lab", 50, 0, 3, "maintenance"),

        # Grand Auditorium
        (b_map["AUD"].id, "AUD-MAIN", "Main Theater Hall", "auditorium", 500, 320, 1, "occupied"),

        # Sports Complex
        (b_map["SPORTS"].id, "S101", "Indoor Court 1", "auditorium", 80, 40, 1, "available"),
        (b_map["SPORTS"].id, "S102", "Fitness & Gym Center", "auditorium", 60, 52, 1, "occupied"),
    ]

    rooms = []
    for b_id, r_num, name, r_type, cap, curr, flr, status in rooms_data:
        crowd = get_crowd(curr, cap)
        room = Room(
            building_id=b_id,
            room_number=r_num,
            name=name,
            room_type=r_type,
            capacity=cap,
            current_occupancy=curr,
            floor=flr,
            status=status,
            crowd_level=crowd
        )
        rooms.append(room)

    db.add_all(rooms)
    db.commit()

    # 3. Users
    users = [
        User(name="Admin User", email="admin@campus.edu", hashed_password="adminpassword123", role="admin"),
        User(name="Dr. Alan Turing", email="alan.turing@campus.edu", hashed_password="facultypassword123", role="faculty"),
        User(name="Jane Doe", email="jane.doe@student.campus.edu", hashed_password="studentpassword123", role="student"),
    ]
    db.add_all(users)
    db.commit()

    # 4. Events
    now = datetime.now()
    events = [
        Event(
            title="Annual Tech Innovation Summit 2026",
            description="Keynote talks on Generative AI, Robotics, and Digital Twins.",
            building_id=b_map["AUD"].id,
            location_name="Grand Auditorium (AUD-MAIN)",
            organizer="CS & AI Department",
            category="Academic",
            start_time=now + timedelta(hours=2),
            end_time=now + timedelta(hours=6)
        ),
        Event(
            title="Hands-on Machine Learning Workshop",
            description="Learn Scikit-Learn and PyTorch in an interactive lab session.",
            building_id=b_map["LAB_HUB"].id,
            location_name="AI & Data Science Lab (H101)",
            organizer="ACM Student Chapter",
            category="Workshop",
            start_time=now + timedelta(days=1, hours=3),
            end_time=now + timedelta(days=1, hours=6)
        ),
        Event(
            title="Inter-College Basketball Championship",
            description="Quarter-finals match between Campus Knights and Tech Titans.",
            building_id=b_map["SPORTS"].id,
            location_name="Sports Complex (Indoor Court 1)",
            organizer="Sports Council",
            category="Sports",
            start_time=now + timedelta(days=2, hours=4),
            end_time=now + timedelta(days=2, hours=7)
        ),
        Event(
            title="Campus Cultural Night & Music Fest",
            description="Live band performances, food pop-ups, and student showcases.",
            building_id=b_map["SC_CAFE"].id,
            location_name="Student Union Open Plaza",
            organizer="Cultural Club",
            category="Cultural",
            start_time=now + timedelta(days=3, hours=5),
            end_time=now + timedelta(days=3, hours=10)
        ),
    ]
    db.add_all(events)
    db.commit()

    # 5. Maintenance Reports
    reports = [
        MaintenanceReport(
            user_name="Jane Doe",
            location="Academic Block A - Room A101",
            title="Projector HD display flickering",
            description="The main classroom HDMI projector output blinks every 30 seconds during lectures.",
            priority="High",
            status="In Progress"
        ),
        MaintenanceReport(
            user_name="Prof. Turing",
            location="Innovation Lab Hub - Room H301",
            title="Air conditioning cooling unit faulty",
            description="Server rack section AC is failing to maintain 20C temperature limit.",
            priority="High",
            status="Reported"
        ),
        MaintenanceReport(
            user_name="Alex Smith",
            location="Central Library - 2nd Floor Group Hub",
            title="Power outlet socket loose",
            description="Desk #4 power socket requires repair.",
            priority="Medium",
            status="Assigned"
        ),
        MaintenanceReport(
            user_name="Anonymous Student",
            location="Student Union Cafeteria",
            title="Water dispenser filter replacement",
            description="Filter indicator light is red.",
            priority="Low",
            status="Resolved"
        )
    ]
    db.add_all(reports)
    db.commit()

    # 6. Initial Occupancy Logs
    db_rooms = db.query(Room).all()
    logs = []
    for r in db_rooms:
        pct = (r.current_occupancy / max(1, r.capacity)) * 100
        logs.append(OccupancyLog(
            room_id=r.id,
            current_count=r.current_occupancy,
            capacity=r.capacity,
            crowd_level=r.crowd_level,
            occupancy_percentage=round(pct, 1),
            timestamp=now
        ))
    db.add_all(logs)
    db.commit()

    print("Database successfully seeded with realistic Digital Twin data!")

if __name__ == "__main__":
    seed_database()
