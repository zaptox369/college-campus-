import { mockStore, calcCrowdLevel } from "./mockData";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL !== undefined
    ? process.env.NEXT_PUBLIC_API_URL
    : typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "/api"
    : "http://127.0.0.1:8000";

// Fallback resolver for simulated live campus twin when backend is unreachable
function resolveFallback(endpoint: string, options: RequestInit = {}) {
  const method = (options.method || "GET").toUpperCase();
  const urlPath = endpoint.split("?")[0];
  const queryString = endpoint.includes("?") ? endpoint.split("?")[1] : "";
  const params = new URLSearchParams(queryString);

  // Buildings
  if (urlPath === "/buildings" && method === "GET") {
    return [...mockStore.buildings];
  }
  const buildingRoomsMatch = urlPath.match(/^\/buildings\/(\d+)\/rooms$/);
  if (buildingRoomsMatch && method === "GET") {
    const bId = parseInt(buildingRoomsMatch[1]);
    const b = mockStore.buildings.find((x) => x.id === bId) || mockStore.buildings[0];
    const rooms = mockStore.rooms.filter((r) => r.building_id === bId);
    const totalCap = rooms.reduce((acc, r) => acc + r.capacity, 0);
    const totalOcc = rooms.reduce((acc, r) => acc + r.current_occupancy, 0);
    return {
      building: b,
      total_rooms: rooms.length,
      total_capacity: totalCap,
      current_occupancy: totalOcc,
      occupancy_percentage: totalCap > 0 ? Math.round((totalOcc / totalCap) * 1000) / 10 : 0,
      rooms: rooms,
    };
  }
  const singleBuildingMatch = urlPath.match(/^\/buildings\/(\d+)$/);
  if (singleBuildingMatch && method === "GET") {
    const bId = parseInt(singleBuildingMatch[1]);
    return mockStore.buildings.find((x) => x.id === bId) || mockStore.buildings[0];
  }

  // Rooms
  if (urlPath === "/rooms" && method === "GET") {
    let result = [...mockStore.rooms];
    const bId = params.get("building_id");
    const rType = params.get("room_type");
    const floor = params.get("floor");
    const status = params.get("status");
    const availOnly = params.get("available_only");

    if (bId) result = result.filter((r) => r.building_id === parseInt(bId));
    if (rType) result = result.filter((r) => r.room_type.toLowerCase().includes(rType.toLowerCase()));
    if (floor) result = result.filter((r) => r.floor === parseInt(floor));
    if (status) result = result.filter((r) => r.status === status);
    if (availOnly === "true") result = result.filter((r) => r.status === "available");
    return result;
  }
  const roomOccupancyMatch = urlPath.match(/^\/rooms\/(\d+)\/occupancy$/);
  if (roomOccupancyMatch && method === "PUT") {
    const rId = parseInt(roomOccupancyMatch[1]);
    const body = options.body ? JSON.parse(options.body as string) : {};
    const room = mockStore.rooms.find((r) => r.id === rId);
    if (room) {
      if (typeof body.current_occupancy === "number") {
        room.current_occupancy = Math.max(0, Math.min(room.capacity, body.current_occupancy));
        room.occupancy_pct = Math.round((room.current_occupancy / Math.max(1, room.capacity)) * 1000) / 10;
        room.crowd_level = calcCrowdLevel(room.current_occupancy, room.capacity);
      }
      if (body.status) {
        room.status = body.status;
      }
      return room;
    }
  }
  const singleRoomMatch = urlPath.match(/^\/rooms\/(\d+)$/);
  if (singleRoomMatch && method === "GET") {
    const rId = parseInt(singleRoomMatch[1]);
    return mockStore.rooms.find((r) => r.id === rId) || mockStore.rooms[0];
  }

  // Events
  if (urlPath === "/events" && method === "GET") {
    return [...mockStore.events];
  }
  if (urlPath === "/events" && method === "POST") {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const newEvent = {
      id: Date.now(),
      title: body.title || "Campus Event",
      description: body.description || "",
      building_id: body.building_id || 1,
      location_name: body.location_name || "Campus Commons",
      organizer: body.organizer || "Student Affairs",
      category: body.category || "General",
      start_time: body.start_time || new Date().toISOString(),
      end_time: body.end_time || new Date(Date.now() + 7200000).toISOString(),
    };
    mockStore.events.unshift(newEvent);
    return newEvent;
  }
  const deleteEventMatch = urlPath.match(/^\/events\/(\d+)$/);
  if (deleteEventMatch && method === "DELETE") {
    const eId = parseInt(deleteEventMatch[1]);
    mockStore.events = mockStore.events.filter((e) => e.id !== eId);
    return { message: "Event deleted successfully" };
  }

  // Maintenance
  if (urlPath === "/maintenance" && method === "GET") {
    return [...mockStore.maintenance];
  }
  if (urlPath === "/maintenance" && method === "POST") {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const newReport: any = {
      id: Date.now(),
      user_name: body.user_name || "Campus Community",
      location: body.location || "General Grounds",
      title: body.title || "Maintenance Alert",
      description: body.description || "",
      priority: body.priority || "Medium",
      status: "Reported",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockStore.maintenance.unshift(newReport);
    return newReport;
  }
  const patchMaintenanceMatch = urlPath.match(/^\/maintenance\/(\d+)\/status$/);
  if (patchMaintenanceMatch && method === "PATCH") {
    const mId = parseInt(patchMaintenanceMatch[1]);
    const body = options.body ? JSON.parse(options.body as string) : {};
    const report = mockStore.maintenance.find((m) => m.id === mId);
    if (report && body.status) {
      report.status = body.status;
      report.updated_at = new Date().toISOString();
      return report;
    }
  }

  // Analytics Summary
  if (urlPath === "/analytics/summary" && method === "GET") {
    return mockStore.getAnalyticsSummary();
  }

  // Predictions
  if (urlPath === "/predictions/all" && method === "GET") {
    const mins = parseInt(params.get("minutes") || "30");
    return mockStore.getPredictions(mins);
  }
  const roomPredictionMatch = urlPath.match(/^\/predictions\/room\/(\d+)$/);
  if (roomPredictionMatch && method === "GET") {
    const rId = parseInt(roomPredictionMatch[1]);
    const mins = parseInt(params.get("minutes") || "30");
    const pred = mockStore.getPredictions(mins);
    const match = pred.forecasts.find((f) => f.room_id === rId);
    return match || pred.forecasts[0];
  }

  // Navigation Route
  if (urlPath.startsWith("/navigation/route") && method === "GET") {
    const origId = parseInt(params.get("origin_building_id") || "1");
    const destId = parseInt(params.get("destination_building_id") || "3");
    return mockStore.getRoute(origId, destId);
  }

  return { message: "Simulated response" };
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast responsiveness

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    // Graceful fallback to rich simulated twin state
    return resolveFallback(endpoint, options);
  }
}

// API methods
export const api = {
  // Buildings
  getBuildings: () => fetchAPI("/buildings"),
  getBuilding: (id: number) => fetchAPI(`/buildings/${id}`),
  getBuildingRooms: (id: number) => fetchAPI(`/buildings/${id}/rooms`),

  // Rooms
  getRooms: (filters?: {
    building_id?: number;
    room_type?: string;
    floor?: number;
    status?: string;
    available_only?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (filters?.building_id)
      params.append("building_id", filters.building_id.toString());
    if (filters?.room_type) params.append("room_type", filters.room_type);
    if (filters?.floor) params.append("floor", filters.floor.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.available_only) params.append("available_only", "true");
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchAPI(`/rooms${query}`);
  },
  getRoom: (id: number) => fetchAPI(`/rooms/${id}`),
  updateRoomOccupancy: (
    id: number,
    current_occupancy: number,
    status?: string,
  ) =>
    fetchAPI(`/rooms/${id}/occupancy`, {
      method: "PUT",
      body: JSON.stringify({ current_occupancy, status }),
    }),

  // Events
  getEvents: () => fetchAPI("/events"),
  createEvent: (data: any) =>
    fetchAPI("/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteEvent: (id: number) =>
    fetchAPI(`/events/${id}`, {
      method: "DELETE",
    }),

  // Maintenance
  getMaintenanceReports: () => fetchAPI("/maintenance"),
  createMaintenanceReport: (data: any) =>
    fetchAPI("/maintenance", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateMaintenanceStatus: (id: number, status: string) =>
    fetchAPI(`/maintenance/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Analytics & ML Predictions
  getAnalyticsSummary: () => fetchAPI("/analytics/summary"),
  getRoomPrediction: (roomId: number, minutes = 30) =>
    fetchAPI(`/predictions/room/${roomId}?minutes=${minutes}`),
  getAllPredictions: (minutes = 30) =>
    fetchAPI(`/predictions/all?minutes=${minutes}`),

  // Navigation
  getRoute: (originBuildingId: number, destBuildingId: number) =>
    fetchAPI(
      `/navigation/route?origin_building_id=${originBuildingId}&destination_building_id=${destBuildingId}`,
    ),
};
