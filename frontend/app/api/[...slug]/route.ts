import { NextRequest, NextResponse } from "next/server";
import { mockStore, calcCrowdLevel } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slugPath = "/" + (params.slug || []).join("/");
  const { searchParams } = new URL(request.url);

  // Buildings
  if (slugPath === "/buildings") {
    return NextResponse.json([...mockStore.buildings]);
  }

  const buildingRoomsMatch = slugPath.match(/^\/buildings\/(\d+)\/rooms$/);
  if (buildingRoomsMatch) {
    const bId = parseInt(buildingRoomsMatch[1]);
    const b = mockStore.buildings.find((x) => x.id === bId) || mockStore.buildings[0];
    const rooms = mockStore.rooms.filter((r) => r.building_id === bId);
    const totalCap = rooms.reduce((acc, r) => acc + r.capacity, 0);
    const totalOcc = rooms.reduce((acc, r) => acc + r.current_occupancy, 0);
    return NextResponse.json({
      building: b,
      total_rooms: rooms.length,
      total_capacity: totalCap,
      current_occupancy: totalOcc,
      occupancy_percentage: totalCap > 0 ? Math.round((totalOcc / totalCap) * 1000) / 10 : 0,
      rooms: rooms,
    });
  }

  const singleBuildingMatch = slugPath.match(/^\/buildings\/(\d+)$/);
  if (singleBuildingMatch) {
    const bId = parseInt(singleBuildingMatch[1]);
    const b = mockStore.buildings.find((x) => x.id === bId);
    if (!b) return NextResponse.json({ detail: "Building not found" }, { status: 404 });
    return NextResponse.json(b);
  }

  // Rooms
  if (slugPath === "/rooms") {
    let result = [...mockStore.rooms];
    const bId = searchParams.get("building_id");
    const rType = searchParams.get("room_type");
    const floor = searchParams.get("floor");
    const status = searchParams.get("status");
    const availOnly = searchParams.get("available_only");

    if (bId) result = result.filter((r) => r.building_id === parseInt(bId));
    if (rType) result = result.filter((r) => r.room_type.toLowerCase().includes(rType.toLowerCase()));
    if (floor) result = result.filter((r) => r.floor === parseInt(floor));
    if (status) result = result.filter((r) => r.status === status);
    if (availOnly === "true") result = result.filter((r) => r.status === "available");
    return NextResponse.json(result);
  }

  const singleRoomMatch = slugPath.match(/^\/rooms\/(\d+)$/);
  if (singleRoomMatch) {
    const rId = parseInt(singleRoomMatch[1]);
    const room = mockStore.rooms.find((r) => r.id === rId);
    if (!room) return NextResponse.json({ detail: "Room not found" }, { status: 404 });
    return NextResponse.json(room);
  }

  // Events
  if (slugPath === "/events") {
    return NextResponse.json([...mockStore.events]);
  }

  // Maintenance
  if (slugPath === "/maintenance") {
    return NextResponse.json([...mockStore.maintenance]);
  }

  // Analytics
  if (slugPath === "/analytics/summary") {
    return NextResponse.json(mockStore.getAnalyticsSummary());
  }

  // Predictions
  if (slugPath === "/predictions/all") {
    const mins = parseInt(searchParams.get("minutes") || "30");
    return NextResponse.json(mockStore.getPredictions(mins));
  }

  const roomPredictionMatch = slugPath.match(/^\/predictions\/room\/(\d+)$/);
  if (roomPredictionMatch) {
    const rId = parseInt(roomPredictionMatch[1]);
    const mins = parseInt(searchParams.get("minutes") || "30");
    const pred = mockStore.getPredictions(mins);
    const match = pred.forecasts.find((f) => f.room_id === rId);
    return NextResponse.json(match || pred.forecasts[0]);
  }

  // Navigation
  if (slugPath === "/navigation/route") {
    const origId = parseInt(searchParams.get("origin_building_id") || "1");
    const destId = parseInt(searchParams.get("destination_building_id") || "3");
    return NextResponse.json(mockStore.getRoute(origId, destId));
  }

  return NextResponse.json({ status: "online", path: slugPath });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slugPath = "/" + (params.slug || []).join("/");
  const body = await request.json().catch(() => ({}));

  if (slugPath === "/events") {
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
    return NextResponse.json(newEvent, { status: 201 });
  }

  if (slugPath === "/maintenance") {
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
    return NextResponse.json(newReport, { status: 201 });
  }

  return NextResponse.json({ message: "Action created", body }, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slugPath = "/" + (params.slug || []).join("/");
  const body = await request.json().catch(() => ({}));

  const roomOccMatch = slugPath.match(/^\/rooms\/(\d+)\/occupancy$/);
  if (roomOccMatch) {
    const rId = parseInt(roomOccMatch[1]);
    const room = mockStore.rooms.find((r) => r.id === rId);
    if (room) {
      if (typeof body.current_occupancy === "number") {
        room.current_occupancy = Math.max(0, Math.min(room.capacity, body.current_occupancy));
        room.occupancy_pct = Math.round((room.current_occupancy / Math.max(1, room.capacity)) * 1000) / 10;
        room.crowd_level = calcCrowdLevel(room.current_occupancy, room.capacity);
      }
      if (body.status) room.status = body.status;
      return NextResponse.json(room);
    }
    return NextResponse.json({ detail: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Updated" });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slugPath = "/" + (params.slug || []).join("/");
  const body = await request.json().catch(() => ({}));

  const maintMatch = slugPath.match(/^\/maintenance\/(\d+)\/status$/);
  if (maintMatch) {
    const mId = parseInt(maintMatch[1]);
    const report = mockStore.maintenance.find((m) => m.id === mId);
    if (report && body.status) {
      report.status = body.status;
      report.updated_at = new Date().toISOString();
      return NextResponse.json(report);
    }
    return NextResponse.json({ detail: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Patched" });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slugPath = "/" + (params.slug || []).join("/");
  const eventMatch = slugPath.match(/^\/events\/(\d+)$/);
  if (eventMatch) {
    const eId = parseInt(eventMatch[1]);
    mockStore.events = mockStore.events.filter((e) => e.id !== eId);
    return NextResponse.json({ message: "Event deleted successfully" });
  }

  return NextResponse.json({ message: "Deleted" });
}
