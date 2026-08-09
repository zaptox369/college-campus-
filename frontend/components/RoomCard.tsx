"use client";

import React, { useState } from "react";
import LiveOccupancyBadge from "./LiveOccupancyBadge";
import RoomDetailModal from "./RoomDetailModal";
import { Users, DoorOpen, Sparkles, Eye, Wifi, Tv, Zap } from "lucide-react";
import { api } from "@/lib/api";

interface RoomCardProps {
  room: {
    id: number;
    building_id: number;
    building_name?: string;
    building_code?: string;
    room_number: string;
    name?: string;
    room_type: string;
    capacity: number;
    current_occupancy: number;
    occupancy_pct: number;
    floor: number;
    status: string;
    crowd_level: string;
  };
  onOccupancyChange?: () => void;
}

export default function RoomCard({ room, onOccupancyChange }: RoomCardProps) {
  const [currOcc, setCurrOcc] = useState(room.current_occupancy);
  const [isUpdating, setIsUpdating] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSliderChange = async (newVal: number) => {
    setCurrOcc(newVal);
    setIsUpdating(true);
    try {
      await api.updateRoomOccupancy(room.id, newVal);
      if (onOccupancyChange) onOccupancyChange();
    } catch (err) {
      console.error("Failed to update room occupancy", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFetchPrediction = async () => {
    if (showPrediction) {
      setShowPrediction(false);
      return;
    }
    try {
      const res = await api.getRoomPrediction(room.id, 30);
      setPrediction(res.forecast);
      setShowPrediction(true);
    } catch (err) {
      console.error("Error fetching room prediction", err);
    }
  };

  const pct = Math.round((currOcc / Math.max(1, room.capacity)) * 100);

  return (
    <>
      <div className="glass-card rounded-3xl p-5 border border-gray-800 flex flex-col justify-between hover:border-blue-500/40 shadow-lg group">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider">
                {room.building_code || room.building_name} • Floor {room.floor}
              </span>
              <h4 className="text-lg font-extrabold text-white mt-0.5 flex items-center gap-2 group-hover:text-blue-300 transition-colors">
                <DoorOpen className="w-5 h-5 text-gray-400" />
                Room {room.room_number} {room.name ? `(${room.name})` : ""}
              </h4>
            </div>
            <LiveOccupancyBadge crowdLevel={room.crowd_level} occupancyPct={pct} />
          </div>

          {/* Info Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-3">
            <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-gray-800 capitalize font-semibold text-gray-200">
              {room.room_type}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-gray-800">
              <Users className="w-3.5 h-3.5 text-blue-400" /> Cap: {room.capacity}
            </span>
            <span className={`px-2.5 py-1 rounded-xl font-bold uppercase text-[10px] ${
              room.status === "available" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
              room.status === "occupied" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
              "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}>
              {room.status}
            </span>
          </div>

          {/* Amenities icons */}
          <div className="flex items-center space-x-3 text-gray-400 text-xs mt-3 px-1">
            <span className="flex items-center gap-1"><Wifi className="w-3.5 h-3.5 text-blue-400" /> Wi-Fi 6</span>
            <span className="flex items-center gap-1"><Tv className="w-3.5 h-3.5 text-indigo-400" /> Smart Display</span>
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Power</span>
          </div>

          {/* Live Occupancy Slider Control */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/70 border border-gray-800/80">
            <div className="flex justify-between items-center text-xs mb-2 font-semibold">
              <span className="text-gray-400">Live Occupancy Simulator:</span>
              <span className="text-white font-extrabold">{currOcc} / {room.capacity}</span>
            </div>
            <input
              type="range"
              min="0"
              max={room.capacity}
              value={currOcc}
              onChange={(e) => handleSliderChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* AI Forecast Box */}
          {showPrediction && prediction && (
            <div className="mt-3 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs animate-fadeIn">
              <div className="flex items-center justify-between font-bold text-indigo-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> AI Forecast (+30 mins)
                </span>
                <span className="text-white bg-indigo-600/40 px-2 py-0.5 rounded-md font-semibold">
                  {prediction.predicted_percentage}% Crowd
                </span>
              </div>
              <p className="text-gray-300 text-[11px] mt-1">{prediction.recommendation}</p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between gap-2">
          <button
            onClick={handleFetchPrediction}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showPrediction ? "Hide AI" : "AI Forecast"}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-2 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> Inspect Room
          </button>
        </div>
      </div>

      {/* Room Detail Modal */}
      <RoomDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={{ ...room, current_occupancy: currOcc }}
        onOccupancyChange={onOccupancyChange}
      />
    </>
  );
}

