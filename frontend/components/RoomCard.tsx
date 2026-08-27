"use client";

import React, { useState } from "react";
import LiveOccupancyBadge from "./LiveOccupancyBadge";
import RoomDetailModal from "./RoomDetailModal";
import { Users, DoorOpen, Sparkles, Eye, Wifi, Tv, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { useTheme } from "./ThemeProvider";

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

  const { playHover, playClick, playPulse } = useTheme();

  const handleSliderChange = async (newVal: number) => {
    setCurrOcc(newVal);
    setIsUpdating(true);
    playPulse();
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
    playClick();
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
      <div
        onMouseEnter={playHover}
        className="glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between hover:border-accent/50 shadow-xl group transition-all duration-300 relative overflow-hidden"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-extrabold text-accent uppercase tracking-wider">
                {room.building_code || room.building_name} • Floor {room.floor}
              </span>
              <h4 className="text-lg font-black text-white mt-0.5 flex items-center gap-2 group-hover:text-accent transition-colors">
                <DoorOpen className="w-5 h-5 text-gray-400 group-hover:text-accent" />
                Room {room.room_number} {room.name ? `(${room.name})` : ""}
              </h4>
            </div>
            <LiveOccupancyBadge crowdLevel={room.crowd_level} occupancyPct={pct} />
          </div>

          {/* Info Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 capitalize font-bold text-gray-200">
              {room.room_type}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 font-bold text-gray-300">
              <Users className="w-3.5 h-3.5 text-accent" /> Cap: {room.capacity}
            </span>
            <span
              className={`px-2.5 py-1 rounded-xl font-extrabold uppercase text-[10px] ${
                room.status === "available"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : room.status === "occupied"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}
            >
              {room.status}
            </span>
          </div>

          {/* Amenities icons */}
          <div className="flex items-center space-x-3 text-gray-400 text-xs px-1">
            <span className="flex items-center gap-1 hover:text-white transition-colors">
              <Wifi className="w-3.5 h-3.5 text-accent" /> 1Gbps Wi-Fi
            </span>
            <span className="flex items-center gap-1 hover:text-white transition-colors">
              <Tv className="w-3.5 h-3.5 text-accent" /> Smart Display
            </span>
          </div>

          {/* Interactive Live Occupancy Slider */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-accent" /> Occupants
              </span>
              <span className="font-mono-code text-accent">
                {currOcc} / {room.capacity} ({pct}%)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={room.capacity}
              value={currOcc}
              onChange={(e) => handleSliderChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
            />
          </div>

          {/* AI Forecast inline preview */}
          {showPrediction && prediction && (
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1 animate-fadeIn">
              <div className="flex items-center justify-between font-bold text-purple-300">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> +30m AI Forecast:
                </span>
                <span className="font-mono-code text-purple-200">
                  {prediction.predicted_occupancy} occupants ({prediction.predicted_occupancy_pct}%)
                </span>
              </div>
              <p className="text-[11px] text-gray-300 italic">{prediction.recommendation}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-white/10">
          <button
            onClick={handleFetchPrediction}
            onMouseEnter={playHover}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-purple-300 hover:text-purple-200 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            {showPrediction ? "Hide AI" : "AI Forecast"}
          </button>
          <button
            onClick={() => {
              playClick();
              setIsModalOpen(true);
            }}
            onMouseEnter={playHover}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl glass-button text-xs font-bold transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-accent" />
            Inspect
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <RoomDetailModal
          room={room}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOccupancyChange={onOccupancyChange}
        />
      )}
    </>
  );
}
