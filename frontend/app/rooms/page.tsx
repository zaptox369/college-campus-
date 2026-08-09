"use client";

import React, { useEffect, useState } from "react";
import RoomCard from "@/components/RoomCard";
import IoTActivityDrawer from "@/components/IoTActivityDrawer";
import { api } from "@/lib/api";
import { connectWebSocket } from "@/lib/websocket";
import { DoorOpen, Search, Filter, Sparkles, Building2, CheckCircle2, Layers } from "lucide-react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [roomsData, bData] = await Promise.all([
        api.getRooms({
          building_id: selectedBuildingId ? parseInt(selectedBuildingId) : undefined,
          room_type: selectedRoomType || undefined,
          floor: selectedFloor ? parseInt(selectedFloor) : undefined,
          available_only: availableOnly,
        }),
        api.getBuildings(),
      ]);
      setRooms(roomsData);
      setBuildings(bData);
    } catch (err) {
      console.error("Error loading rooms", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const cleanupWS = connectWebSocket(() => {
      loadData();
    });

    return () => cleanupWS();
  }, [selectedBuildingId, selectedRoomType, selectedFloor, availableOnly]);

  const filteredRooms = rooms.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.room_number.toLowerCase().includes(q) ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      r.building_name.toLowerCase().includes(q) ||
      r.room_type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <DoorOpen className="w-9 h-9 text-blue-500" />
          Campus Room Finder & Live Availability
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Explore study pods, computer labs, lecture halls, and open classrooms with live IoT occupancy simulation.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-blue-500/20 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-blue-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search room (e.g. A101, Physics Lab, Library)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none font-medium"
            />
          </div>

          {/* Building Select */}
          <div>
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none font-medium"
            >
              <option value="">All Campus Buildings</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Room Type Select */}
          <div>
            <select
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none font-medium"
            >
              <option value="">All Room Types</option>
              <option value="classroom">Classroom</option>
              <option value="lab">Innovation / Science Lab</option>
              <option value="library">Library Quiet Pod</option>
              <option value="auditorium">Auditorium / Theater</option>
              <option value="cafe">Cafe / Dining Hub</option>
              <option value="office">Office / Conference</option>
            </select>
          </div>

          {/* Floor Select */}
          <div>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none font-medium"
            >
              <option value="">All Floors</option>
              <option value="1">Floor 1 (Ground)</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
              <option value="4">Floor 4</option>
            </select>
          </div>
        </div>

        {/* Toggle Available Bar */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-800/80 text-xs">
          <span className="text-gray-400 font-medium">
            Showing <strong className="text-white">{filteredRooms.length}</strong> matching rooms
          </span>

          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
              availableOnly
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-inner"
                : "bg-slate-950 text-gray-400 border-gray-800 hover:border-gray-700"
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${availableOnly ? "text-emerald-400" : "text-gray-500"}`} />
            {availableOnly ? "Showing Available Only" : "Show Available Only"}
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <p className="text-xs text-gray-400 text-center py-16">Loading live room occupancy index...</p>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onOccupancyChange={() => loadData()} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl border border-gray-800 text-center text-gray-400 space-y-3 shadow-xl">
          <DoorOpen className="w-10 h-10 text-gray-600 mx-auto" />
          <p className="text-base font-bold text-white">No matching rooms found.</p>
          <p className="text-xs text-gray-400">Try clearing or adjusting your search filters above.</p>
        </div>
      )}

      {/* Floating IoT Stream Drawer */}
      <IoTActivityDrawer />
    </div>
  );
}

