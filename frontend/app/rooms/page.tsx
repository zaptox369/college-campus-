"use client";

import React, { useEffect, useState } from "react";
import RoomCard from "@/components/RoomCard";
import { api } from "@/lib/api";
import { connectWebSocket } from "@/lib/websocket";
import { DoorOpen, Search, Filter, Sparkles, Building2, CheckCircle2 } from "lucide-react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [roomsData, bData] = await Promise.all([
        api.getRooms({
          building_id: selectedBuildingId ? parseInt(selectedBuildingId) : undefined,
          room_type: selectedRoomType || undefined,
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
  }, [selectedBuildingId, selectedRoomType, availableOnly]);

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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <DoorOpen className="w-8 h-8 text-blue-500" />
          Campus Room Finder & Availability
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Find available study pods, computer labs, lecture halls, and open classrooms across campus in real time.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search room (e.g. A101, Physics Lab)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Building Select */}
          <div>
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Buildings</option>
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none"
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

          {/* Available Only Toggle */}
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
              availableOnly
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-inner"
                : "bg-slate-900 text-gray-400 border-gray-800 hover:border-gray-700"
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${availableOnly ? "text-emerald-400" : "text-gray-500"}`} />
            {availableOnly ? "Showing Available Only" : "Show Available Only"}
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <p className="text-xs text-gray-400 text-center py-12">Loading room data...</p>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onOccupancyChange={() => loadData()} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-gray-800 text-center text-gray-400 space-y-2">
          <DoorOpen className="w-8 h-8 text-gray-600 mx-auto" />
          <p className="text-sm font-semibold">No matching rooms found.</p>
          <p className="text-xs text-gray-500">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
