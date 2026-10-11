// High-fidelity fallback dataset for Digital Twin Campus
// Ensures zero-downtime demonstration on Vercel or when backend is connecting

export interface BuildingData {
  id: number;
  code: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  floors: number;
  category: string;
}

export interface RoomData {
  id: number;
  building_id: number;
  building_name: string;
  building_code: string;
  room_number: string;
  name: string;
  room_type: string;
  capacity: number;
  current_occupancy: number;
  occupancy_pct: number;
  floor: number;
  status: "available" | "occupied" | "maintenance";
  crowd_level: "Low" | "Medium" | "High" | "Very High";
}

export interface EventData {
  id: number;
  title: string;
  description: string;
  building_id: number;
  location_name: string;
  organizer: string;
  category: string;
  start_time: string;
  end_time: string;
}

export interface MaintenanceData {
  id: number;
  user_name: string;
  location: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Reported" | "Assigned" | "In Progress" | "Resolved";
  created_at: string;
  updated_at: string;
}

// Initial Buildings
export const initialBuildings: BuildingData[] = [
  { id: 1, code: "ACAD_A", name: "Academic Block A", description: "Primary lecture halls, engineering classrooms, and faculty offices.", latitude: 12.9716, longitude: 77.5946, floors: 4, category: "academic" },
  { id: 2, code: "ACAD_B", name: "Academic Block B", description: "Humanities, mathematics department, and seminar halls.", latitude: 12.9720, longitude: 77.5950, floors: 3, category: "academic" },
  { id: 3, code: "LIB", name: "Central Library", description: "Multi-story digital and print resource library with quiet study pods.", latitude: 12.9710, longitude: 77.5940, floors: 3, category: "library" },
  { id: 4, code: "SC_CAFE", name: "Student Union & Cafeteria", description: "Dining court, student lounge, and campus merchandise store.", latitude: 12.9725, longitude: 77.5935, floors: 2, category: "dining" },
  { id: 5, code: "LAB_HUB", name: "Innovation & Tech Labs", description: "Advanced Computer Science, Robotics, and AI research labs.", latitude: 12.9705, longitude: 77.5955, floors: 3, category: "academic" },
  { id: 6, code: "AUD", name: "Grand Auditorium", description: "500-seat multi-purpose hall for cultural events, convocations, and fests.", latitude: 12.9730, longitude: 77.5942, floors: 2, category: "admin" },
  { id: 7, code: "SPORTS", name: "Sports Complex", description: "Indoor basketball court, badminton, gymnasium, and swimming pool.", latitude: 12.9698, longitude: 77.5960, floors: 2, category: "sports" }
];

// Helper to determine crowd level
export function calcCrowdLevel(curr: number, cap: number): "Low" | "Medium" | "High" | "Very High" {
  const pct = curr / Math.max(1, cap);
  if (pct < 0.4) return "Low";
  if (pct < 0.7) return "Medium";
  if (pct < 0.9) return "High";
  return "Very High";
}

// Initial Rooms
export const initialRooms: RoomData[] = [
  // Academic Block A
  { id: 1, building_id: 1, building_code: "ACAD_A", building_name: "Academic Block A", room_number: "A101", name: "Lecture Hall 1", room_type: "classroom", capacity: 60, current_occupancy: 42, occupancy_pct: 70.0, floor: 1, status: "occupied", crowd_level: "High" },
  { id: 2, building_id: 1, building_code: "ACAD_A", building_name: "Academic Block A", room_number: "A102", name: "Smart Classroom 2", room_type: "classroom", capacity: 40, current_occupancy: 12, occupancy_pct: 30.0, floor: 1, status: "available", crowd_level: "Low" },
  { id: 3, building_id: 1, building_code: "ACAD_A", building_name: "Academic Block A", room_number: "A201", name: "Physics Lab", room_type: "lab", capacity: 35, current_occupancy: 30, occupancy_pct: 85.7, floor: 2, status: "occupied", crowd_level: "High" },
  { id: 4, building_id: 1, building_code: "ACAD_A", building_name: "Academic Block A", room_number: "A202", name: "Electronics Lab", room_type: "lab", capacity: 30, current_occupancy: 0, occupancy_pct: 0.0, floor: 2, status: "available", crowd_level: "Low" },
  { id: 5, building_id: 1, building_code: "ACAD_A", building_name: "Academic Block A", room_number: "A301", name: "Seminar Room A", room_type: "classroom", capacity: 80, current_occupancy: 75, occupancy_pct: 93.8, floor: 3, status: "occupied", crowd_level: "Very High" },
  { id: 6, building_id: 1, building_code: "ACAD_A", building_name: "Academic Block A", room_number: "A401", name: "Faculty Conference Room", room_type: "office", capacity: 25, current_occupancy: 5, occupancy_pct: 20.0, floor: 4, status: "available", crowd_level: "Low" },

  // Academic Block B
  { id: 7, building_id: 2, building_code: "ACAD_B", building_name: "Academic Block B", room_number: "B101", name: "Math Lecture Room", room_type: "classroom", capacity: 50, current_occupancy: 18, occupancy_pct: 36.0, floor: 1, status: "available", crowd_level: "Low" },
  { id: 8, building_id: 2, building_code: "ACAD_B", building_name: "Academic Block B", room_number: "B102", name: "Statistics Lab", room_type: "lab", capacity: 40, current_occupancy: 38, occupancy_pct: 95.0, floor: 1, status: "occupied", crowd_level: "Very High" },
  { id: 9, building_id: 2, building_code: "ACAD_B", building_name: "Academic Block B", room_number: "B201", name: "Humanities Workshop", room_type: "classroom", capacity: 45, current_occupancy: 0, occupancy_pct: 0.0, floor: 2, status: "available", crowd_level: "Low" },
  { id: 10, building_id: 2, building_code: "ACAD_B", building_name: "Academic Block B", room_number: "B301", name: "Dean Conference Room", room_type: "office", capacity: 20, current_occupancy: 8, occupancy_pct: 40.0, floor: 3, status: "available", crowd_level: "Medium" },

  // Central Library
  { id: 11, building_id: 3, building_code: "LIB", building_name: "Central Library", room_number: "L101", name: "Silent Reading Zone", room_type: "library", capacity: 100, current_occupancy: 82, occupancy_pct: 82.0, floor: 1, status: "occupied", crowd_level: "High" },
  { id: 12, building_id: 3, building_code: "LIB", building_name: "Central Library", room_number: "L201", name: "Group Study Hub", room_type: "library", capacity: 60, current_occupancy: 45, occupancy_pct: 75.0, floor: 2, status: "occupied", crowd_level: "High" },
  { id: 13, building_id: 3, building_code: "LIB", building_name: "Central Library", room_number: "L301", name: "Digital Media Archive", room_type: "library", capacity: 40, current_occupancy: 10, occupancy_pct: 25.0, floor: 3, status: "available", crowd_level: "Low" },

  // Cafeteria
  { id: 14, building_id: 4, building_code: "SC_CAFE", building_name: "Student Union & Cafeteria", room_number: "C101", name: "Main Dining Court", room_type: "cafe", capacity: 150, current_occupancy: 135, occupancy_pct: 90.0, floor: 1, status: "occupied", crowd_level: "Very High" },
  { id: 15, building_id: 4, building_code: "SC_CAFE", building_name: "Student Union & Cafeteria", room_number: "C102", name: "Coffee Lounge & Bookstore", room_type: "cafe", capacity: 50, current_occupancy: 28, occupancy_pct: 56.0, floor: 1, status: "available", crowd_level: "Medium" },
  { id: 16, building_id: 4, building_code: "SC_CAFE", building_name: "Student Union & Cafeteria", room_number: "C201", name: "Student Council Lounge", room_type: "office", capacity: 30, current_occupancy: 15, occupancy_pct: 50.0, floor: 2, status: "available", crowd_level: "Medium" },

  // Innovation & Tech Labs
  { id: 17, building_id: 5, building_code: "LAB_HUB", building_name: "Innovation & Tech Labs", room_number: "H101", name: "AI & Data Science Lab", room_type: "lab", capacity: 45, current_occupancy: 41, occupancy_pct: 91.1, floor: 1, status: "occupied", crowd_level: "Very High" },
  { id: 18, building_id: 5, building_code: "LAB_HUB", building_name: "Innovation & Tech Labs", room_number: "H102", name: "Robotics & IoT Lab", room_type: "lab", capacity: 35, current_occupancy: 20, occupancy_pct: 57.1, floor: 1, status: "available", crowd_level: "Medium" },
  { id: 19, building_id: 5, building_code: "LAB_HUB", building_name: "Innovation & Tech Labs", room_number: "H201", name: "Cybersecurity Sandbox", room_type: "lab", capacity: 40, current_occupancy: 35, occupancy_pct: 87.5, floor: 2, status: "occupied", crowd_level: "High" },
  { id: 20, building_id: 5, building_code: "LAB_HUB", building_name: "Innovation & Tech Labs", room_number: "H301", name: "Cloud Computing Center", room_type: "lab", capacity: 50, current_occupancy: 0, occupancy_pct: 0.0, floor: 3, status: "maintenance", crowd_level: "Low" },

  // Grand Auditorium & Sports
  { id: 21, building_id: 6, building_code: "AUD", building_name: "Grand Auditorium", room_number: "AUD-MAIN", name: "Main Theater Hall", room_type: "auditorium", capacity: 500, current_occupancy: 320, occupancy_pct: 64.0, floor: 1, status: "occupied", crowd_level: "Medium" },
  { id: 22, building_id: 7, building_code: "SPORTS", building_name: "Sports Complex", room_number: "S101", name: "Indoor Court 1", room_type: "auditorium", capacity: 80, current_occupancy: 40, occupancy_pct: 50.0, floor: 1, status: "available", crowd_level: "Medium" },
  { id: 23, building_id: 7, building_code: "SPORTS", building_name: "Sports Complex", room_number: "S102", name: "Fitness & Gym Center", room_type: "auditorium", capacity: 60, current_occupancy: 52, occupancy_pct: 86.7, floor: 1, status: "occupied", crowd_level: "High" }
];

// Initial Events
export const initialEvents: EventData[] = [
  {
    id: 1,
    title: "Annual Tech Innovation Summit 2026",
    description: "Keynote talks on Generative AI, Robotics, and Digital Twins.",
    building_id: 6,
    location_name: "Grand Auditorium (AUD-MAIN)",
    organizer: "CS & AI Department",
    category: "Academic",
    start_time: new Date(Date.now() + 2 * 3600000).toISOString(),
    end_time: new Date(Date.now() + 6 * 3600000).toISOString()
  },
  {
    id: 2,
    title: "Hands-on Machine Learning Workshop",
    description: "Learn Scikit-Learn and PyTorch in an interactive lab session.",
    building_id: 5,
    location_name: "AI & Data Science Lab (H101)",
    organizer: "ACM Student Chapter",
    category: "Workshop",
    start_time: new Date(Date.now() + 27 * 3600000).toISOString(),
    end_time: new Date(Date.now() + 30 * 3600000).toISOString()
  },
  {
    id: 3,
    title: "Inter-College Basketball Championship",
    description: "Quarter-finals match between Campus Knights and Tech Titans.",
    building_id: 7,
    location_name: "Sports Complex (Indoor Court 1)",
    organizer: "Sports Council",
    category: "Sports",
    start_time: new Date(Date.now() + 52 * 3600000).toISOString(),
    end_time: new Date(Date.now() + 55 * 3600000).toISOString()
  },
  {
    id: 4,
    title: "Campus Cultural Night & Music Fest",
    description: "Live band performances, food pop-ups, and student showcases.",
    building_id: 4,
    location_name: "Student Union Open Plaza",
    organizer: "Cultural Club",
    category: "Cultural",
    start_time: new Date(Date.now() + 77 * 3600000).toISOString(),
    end_time: new Date(Date.now() + 82 * 3600000).toISOString()
  }
];

// Initial Maintenance Reports
export const initialMaintenance: MaintenanceData[] = [
  {
    id: 1,
    user_name: "Jane Doe",
    location: "Academic Block A - Room A101",
    title: "Projector HD display flickering",
    description: "The main classroom HDMI projector output blinks every 30 seconds during lectures.",
    priority: "High",
    status: "In Progress",
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString()
  },
  {
    id: 2,
    user_name: "Prof. Turing",
    location: "Innovation Lab Hub - Room H301",
    title: "Air conditioning cooling unit faulty",
    description: "Server rack section AC is failing to maintain 20C temperature limit.",
    priority: "High",
    status: "Reported",
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    id: 3,
    user_name: "Alex Smith",
    location: "Central Library - 2nd Floor Group Hub",
    title: "Power outlet socket loose",
    description: "Desk #4 power socket requires repair.",
    priority: "Medium",
    status: "Assigned",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    id: 4,
    user_name: "Anonymous Student",
    location: "Student Union Cafeteria",
    title: "Water dispenser filter replacement",
    description: "Filter indicator light is red.",
    priority: "Low",
    status: "Resolved",
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

// Peak Hours Distribution
export const peakHoursData = [
  { hour: "08:00 AM", occupancy_pct: 25 },
  { hour: "09:00 AM", occupancy_pct: 55 },
  { hour: "10:00 AM", occupancy_pct: 78 },
  { hour: "11:00 AM", occupancy_pct: 88 },
  { hour: "12:00 PM", occupancy_pct: 82 },
  { hour: "01:00 PM", occupancy_pct: 65 },
  { hour: "02:00 PM", occupancy_pct: 79 },
  { hour: "03:00 PM", occupancy_pct: 74 },
  { hour: "04:00 PM", occupancy_pct: 60 },
  { hour: "05:00 PM", occupancy_pct: 45 },
  { hour: "06:00 PM", occupancy_pct: 30 },
  { hour: "07:00 PM", occupancy_pct: 18 },
];

// In-memory working copy for realistic live mutations
class MockStore {
  rooms: RoomData[] = JSON.parse(JSON.stringify(initialRooms));
  buildings: BuildingData[] = JSON.parse(JSON.stringify(initialBuildings));
  events: EventData[] = JSON.parse(JSON.stringify(initialEvents));
  maintenance: MaintenanceData[] = JSON.parse(JSON.stringify(initialMaintenance));

  getAnalyticsSummary() {
    const totalCapacity = this.rooms.reduce((acc, r) => acc + r.capacity, 0);
    const currentOccupancy = this.rooms.reduce((acc, r) => acc + r.current_occupancy, 0);
    const campusPct = Math.round((currentOccupancy / Math.max(1, totalCapacity)) * 1000) / 10;

    const buildingAnalytics = this.buildings.map((b) => {
      const bRooms = this.rooms.filter((r) => r.building_id === b.id);
      const bCap = bRooms.reduce((acc, r) => acc + r.capacity, 0);
      const bOcc = bRooms.reduce((acc, r) => acc + r.current_occupancy, 0);
      const bPct = bCap > 0 ? Math.round((bOcc / bCap) * 1000) / 10 : 0;
      return {
        building_id: b.id,
        code: b.code,
        name: b.name,
        category: b.category,
        room_count: bRooms.length,
        total_capacity: bCap,
        current_occupancy: bOcc,
        occupancy_pct: bPct
      };
    });

    const crowdCounts = {
      Low: this.rooms.filter((r) => r.crowd_level === "Low").length,
      Medium: this.rooms.filter((r) => r.crowd_level === "Medium").length,
      High: this.rooms.filter((r) => r.crowd_level === "High").length,
      "Very High": this.rooms.filter((r) => r.crowd_level === "Very High").length
    };

    return {
      kpis: {
        total_buildings: this.buildings.length,
        total_rooms: this.rooms.length,
        available_rooms: this.rooms.filter((r) => r.status === "available").length,
        occupied_rooms: this.rooms.filter((r) => r.status === "occupied").length,
        maintenance_rooms: this.rooms.filter((r) => r.status === "maintenance").length,
        total_capacity: totalCapacity,
        current_occupancy: currentOccupancy,
        campus_occupancy_pct: campusPct,
        active_events: this.events.length,
        open_maintenance_reports: this.maintenance.filter((m) => m.status !== "Resolved").length
      },
      crowd_counts: crowdCounts,
      building_analytics: buildingAnalytics,
      peak_hours_data: peakHoursData
    };
  }

  getRoute(originId: number, destId: number) {
    const origin = this.buildings.find((b) => b.id === originId) || this.buildings[0];
    const dest = this.buildings.find((b) => b.id === destId) || this.buildings[1];

    if (origin.id === dest.id) {
      return {
        origin: origin.name,
        destination: dest.name,
        distance_meters: 0,
        estimated_walking_time_mins: 0,
        steps: ["You are already at the target building."]
      };
    }

    const dist = 180 + Math.abs(origin.id - dest.id) * 65;
    const walkingMins = Math.max(2, Math.round(dist / 75));

    return {
      origin: {
        id: origin.id,
        code: origin.code,
        name: origin.name,
        latitude: origin.latitude,
        longitude: origin.longitude
      },
      destination: {
        id: dest.id,
        code: dest.code,
        name: dest.name,
        latitude: dest.latitude,
        longitude: dest.longitude
      },
      distance_meters: dist,
      estimated_walking_time_mins: walkingMins,
      steps: [
        `Depart from ${origin.name} (${origin.code}) ground lobby.`,
        "Cross through the pedestrian central campus promenade.",
        "Take the tree-lined path towards the quad walkway.",
        `Arrive at ${dest.name} main portal entrance.`
      ]
    };
  }

  getPredictions(minutes: number = 30) {
    const forecasts = this.rooms.map((r) => {
      // Dynamic simulated ML shift based on time horizon
      const variation = Math.sin((r.id * 1.5) + (minutes / 20)) * 0.25;
      const predictedOcc = Math.max(0, Math.min(r.capacity, Math.round(r.current_occupancy * (1 + variation))));
      const predictedPct = Math.round((predictedOcc / Math.max(1, r.capacity)) * 1000) / 10;
      const trend = predictedOcc > r.current_occupancy ? "Surging" : predictedOcc < r.current_occupancy ? "Cooling" : "Stable";

      return {
        room_id: r.id,
        room_number: r.room_number,
        name: r.name,
        building_code: r.building_code,
        building_name: r.building_name,
        room_type: r.room_type,
        capacity: r.capacity,
        current_occupancy: r.current_occupancy,
        current_crowd_level: r.crowd_level,
        forecast: {
          predicted_occupancy: predictedOcc,
          predicted_occupancy_percentage: predictedPct,
          predicted_crowd_level: calcCrowdLevel(predictedOcc, r.capacity),
          confidence_score: 0.91,
          trend: trend,
          minutes_ahead: minutes
        }
      };
    });

    return {
      time_horizon_minutes: minutes,
      total_rooms_analyzed: this.rooms.length,
      forecasts: forecasts
    };
  }
}

export const mockStore = new MockStore();
