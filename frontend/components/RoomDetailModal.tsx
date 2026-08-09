"use client";

import React, { useState } from "react";
import { X, DoorOpen, Users, Tv, Wifi, Zap, Wind, Calendar, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    id: number;
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
  } | null;
  onOccupancyChange?: () => void;
}

export default function RoomDetailModal({ isOpen, onClose, room, onOccupancyChange }: RoomDetailModalProps) {
  const [isReserving, setIsReserving] = useState(false);
  const [reservedSuccess, setReservedSuccess] = useState(false);
  const [currOcc, setCurrOcc] = useState(room ? room.current_occupancy : 0);
  const [prediction, setPrediction] = useState<any>(null);
  const [loadingPred, setLoadingPred] = useState(false);

  if (!isOpen || !room) return null;

  const handleReservePod = async () => {
    setIsReserving(true);
    try {
      // Simulate booking by adding +1 occupancy if available
      const newOcc = Math.min(room.capacity, currOcc + 1);
      await api.updateRoomOccupancy(room.id, newOcc);
      setCurrOcc(newOcc);
      setReservedSuccess(true);
      if (onOccupancyChange) onOccupancyChange();
      setTimeout(() => setReservedSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to reserve pod", err);
    } finally {
      setIsReserving(false);
    }
  };

  const handleFetchPrediction = async () => {
    setLoadingPred(true);
    try {
      const res = await api.getRoomPrediction(room.id, 30);
      setPrediction(res.forecast);
    } catch (err) {
      console.error("Failed to fetch prediction", err);
    } finally {
      setLoadingPred(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-xl bg-slate-900/90 border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-slate-950/60">
          <div>
            <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider">
              {room.building_code || room.building_name} • Floor {room.floor}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5 flex items-center gap-2">
              <DoorOpen className="w-6 h-6 text-blue-400" /> Room {room.room_number} {room.name ? `(${room.name})` : ""}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Reservation Toast Alert */}
          {reservedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">Desk Reserved Successfully!</p>
                <p className="text-[11px] text-emerald-200">Your pass is active for 60 minutes in Room {room.room_number}.</p>
              </div>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">Capacity</span>
              <span className="text-lg font-black text-white flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-4 h-4 text-blue-400" /> {room.capacity}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">Occupancy</span>
              <span className="text-lg font-black text-blue-400 mt-0.5 block">{currOcc} seats</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">Crowd Status</span>
              <span className={`text-xs font-bold uppercase mt-1 px-2 py-0.5 rounded-md inline-block ${
                room.crowd_level === "Low" ? "bg-emerald-500/20 text-emerald-400" :
                room.crowd_level === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"
              }`}>
                {room.crowd_level}
              </span>
            </div>
          </div>

          {/* Room Amenities */}
          <div>
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Available Amenities</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-200 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-blue-400" /> High-speed Wi-Fi 6
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-200 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-indigo-400" /> 4K Smart Display
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Power Outlets at Seats
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-200 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" /> HVAC Climate Control
              </span>
            </div>
          </div>

          {/* AI Crowd Forecast section */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> AI Crowd Forecast (Next 30 Mins)
              </h4>
              <button
                onClick={handleFetchPrediction}
                disabled={loadingPred}
                className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-bold transition-all"
              >
                {loadingPred ? "Predicting..." : "Run AI Forecast"}
              </button>
            </div>

            {prediction ? (
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-gray-300">Predicted Crowd Index:</span>
                  <span className="text-indigo-400 font-extrabold text-sm">{prediction.predicted_percentage}%</span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">{prediction.recommendation}</p>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400">Click &quot;Run AI Forecast&quot; to predict demand trends.</p>
            )}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-5 border-t border-gray-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs transition-all"
          >
            Close
          </button>

          <button
            onClick={handleReservePod}
            disabled={isReserving || currOcc >= room.capacity}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 ${
              currOcc >= room.capacity
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25"
            }`}
          >
            <Calendar className="w-4 h-4" />
            {isReserving ? "Reserving..." : currOcc >= room.capacity ? "Room Full" : "Reserve Desk / Pod"}
          </button>
        </div>
      </div>
    </div>
  );
}
