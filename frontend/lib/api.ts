const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.error(`Fetch API Error (${endpoint}):`, err);
    throw err;
  }
}

// API methods
export const api = {
  // Buildings
  getBuildings: () => fetchAPI("/buildings"),
  getBuilding: (id: number) => fetchAPI(`/buildings/${id}`),
  getBuildingRooms: (id: number) => fetchAPI(`/buildings/${id}/rooms`),

  // Rooms
  getRooms: (filters?: { building_id?: number; room_type?: string; floor?: number; status?: string; available_only?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.building_id) params.append("building_id", filters.building_id.toString());
    if (filters?.room_type) params.append("room_type", filters.room_type);
    if (filters?.floor) params.append("floor", filters.floor.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.available_only) params.append("available_only", "true");
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchAPI(`/rooms${query}`);
  },
  getRoom: (id: number) => fetchAPI(`/rooms/${id}`),
  updateRoomOccupancy: (id: number, current_occupancy: number, status?: string) =>
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
  getRoomPrediction: (roomId: number, minutes = 30) => fetchAPI(`/predictions/room/${roomId}?minutes=${minutes}`),
  getAllPredictions: (minutes = 30) => fetchAPI(`/predictions/all?minutes=${minutes}`),

  // Navigation
  getRoute: (originBuildingId: number, destBuildingId: number) =>
    fetchAPI(`/navigation/route?origin_building_id=${originBuildingId}&destination_building_id=${destBuildingId}`),
};
