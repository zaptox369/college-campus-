"use client";

import React, { useEffect, useState } from "react";
import CampusMapSVG from "@/components/CampusMapSVG";
import RoomCard from "@/components/RoomCard";
import IoTActivityDrawer from "@/components/IoTActivityDrawer";
import { api } from "@/lib/api";
import { connectWebSocket } from "@/lib/websocket";
import { MapPin, Building2, DoorOpen, Layers, Filter } from "lucide-react";

export default function CampusMapPage() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [buildingRooms, setBuildingRooms] = useState<any[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);

  const loadMapData = async () => {
    try {
      const summary = await api.getAnalyticsSummary();
      setBuildings(summary.building_analytics);
      if (summary.building_analytics.length > 0 && !selectedBuilding) {
        setSelectedBuilding(summary.building_analytics[0]);
      }
    } catch (err) {
      console.error("Error loading map data", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsForBuilding = async (buildingId: number) => {
    try {
      const res = await api.getBuildingRooms(buildingId);
      setBuildingRooms(res.rooms);
    } catch (err) {
      console.error("Error loading building rooms", err);
    }
  };

  useEffect(() => {
    loadMapData();

    const cleanupWS = connectWebSocket(() => {
      loadMapData();
      if (selectedBuilding) {
        loadRoomsForBuilding(selectedBuilding.id);
      }
    });

    return () => cleanupWS();
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      loadRoomsForBuilding(selectedBuilding.id);
    }
  }, [selectedBuilding]);

  const filteredRooms = buildingRooms.filter((r) => {
    if (selectedFloor === "all") return true;
    return r.floor === selectedFloor;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <MapPin className="w-9 h-9 text-blue-500" />
          Interactive Virtual Campus Map Blueprint
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Explore campus buildings, inspect floor plans, observe live crowd density heatmaps, and simulate IoT occupancy.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SVG Blueprint */}
        <div className="lg:col-span-7">
          <CampusMapSVG
            buildings={buildings}
            selectedBuildingId={selectedBuilding?.id}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
          />
        </div>

        {/* Selected Building Details & Floor Rooms */}
        <div className="lg:col-span-5 space-y-6">
          {selectedBuilding ? (
            <div className="glass-panel rounded-3xl p-6 border border-blue-500/20 shadow-2xl space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md">
                    {selectedBuilding.category}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1.5">{selectedBuilding.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono-code">Building Code: {selectedBuilding.code}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-400">{selectedBuilding.occupancy_pct}%</span>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Current Load</span>
                </div>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-gray-800 text-center">
                <div>
                  <span className="text-xs text-gray-400 block font-semibold">Rooms</span>
                  <span className="text-base font-black text-white">{selectedBuilding.room_count}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold">Occupied</span>
                  <span className="text-base font-black text-blue-400">{selectedBuilding.current_occupancy}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold">Capacity</span>
                  <span className="text-base font-black text-white">{selectedBuilding.total_capacity}</span>
                </div>
              </div>

              {/* Floor Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" /> Filter Floor:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedFloor("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedFloor === "all"
                        ? "bg-blue-600 text-white border-blue-500 shadow-md"
                        : "bg-slate-950 text-gray-400 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    All Floors
                  </button>
                  {[1, 2, 3, 4].map((flr) => (
                    <button
                      key={flr}
                      onClick={() => setSelectedFloor(flr)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedFloor === flr
                          ? "bg-blue-600 text-white border-blue-500 shadow-md"
                          : "bg-slate-950 text-gray-400 border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      Floor {flr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Cards List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={{
                        ...room,
                        building_name: selectedBuilding.name,
                        building_code: selectedBuilding.code,
                        occupancy_pct: Math.round((room.current_occupancy / Math.max(1, room.capacity)) * 100),
                      }}
                      onOccupancyChange={() => loadMapData()}
                    />
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-6">No rooms found on this floor.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 border border-gray-800 text-center text-gray-400 shadow-xl">
              Select a building from the map blueprint to inspect rooms.
            </div>
          )}
        </div>
      </div>

      {/* Floating IoT Activity Drawer */}
      <IoTActivityDrawer />
    </div>
  );
}

