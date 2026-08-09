"use client";

import React, { useEffect, useState } from "react";
import LiveOccupancyBadge from "@/components/LiveOccupancyBadge";
import IoTActivityDrawer from "@/components/IoTActivityDrawer";
import { api } from "@/lib/api";
import { Brain, Sparkles, Clock, AlertTriangle, CheckCircle2, TrendingUp, Sliders } from "lucide-react";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [minutesAhead, setMinutesAhead] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);

  const loadPredictions = async (mins: number) => {
    setLoading(true);
    try {
      const res = await api.getAllPredictions(mins);
      setPredictions(res.forecasts);
    } catch (err) {
      console.error("Error loading predictions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions(minutesAhead);
  }, [minutesAhead]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Brain className="w-9 h-9 text-purple-400" />
            AI Machine Learning Crowd Forecast Engine
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Random Forest ML model forecasting room crowd density, bottleneck surges, and ideal quiet study times across campus.
          </p>
        </div>
      </div>

      {/* Time Horizon Slider Control */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel bg-gradient-to-r from-purple-950/60 via-slate-950/80 to-indigo-950/60 border border-purple-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-inner">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white">Live ML Forecast Horizon: +{minutesAhead} Minutes</h4>
              <p className="text-xs text-gray-400">
                Adjust the slider below to project room demand into the future.
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-gray-800">
            {[15, 30, 60, 120, 240].map((m) => (
              <button
                key={m}
                onClick={() => setMinutesAhead(m)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  minutesAhead === m
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                +{m >= 60 ? `${m / 60}h` : `${m}m`}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-bold text-gray-300">
            <span>+15 mins (Now)</span>
            <span className="text-purple-400 font-extrabold text-sm">+ {minutesAhead} Minutes Forecast</span>
            <span>+4 Hours (+240 mins)</span>
          </div>
          <input
            type="range"
            min="15"
            max="240"
            step="15"
            value={minutesAhead}
            onChange={(e) => setMinutesAhead(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>

      {/* Forecast Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center animate-spin">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs text-gray-400 font-bold">Evaluating Random Forest ML Crowd Engine (+{minutesAhead}m)...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((pred) => (
            <div key={pred.room_id} className="glass-card rounded-3xl p-6 border border-gray-800 space-y-4 hover:border-purple-500/40 shadow-xl group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-purple-400 uppercase tracking-wider">
                    {pred.building_code} • {pred.building_name}
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5 group-hover:text-purple-300 transition-colors">
                    Room {pred.room_number} {pred.name ? `(${pred.name})` : ""}
                  </h3>
                </div>
                <LiveOccupancyBadge crowdLevel={pred.predicted_crowd_level} occupancyPct={pred.predicted_percentage} />
              </div>

              {/* Current vs Predicted comparison */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-gray-800 text-center text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Current Count</span>
                  <span className="text-white font-extrabold text-sm mt-0.5 block">{pred.current_occupancy} / {pred.capacity}</span>
                </div>
                <div className="border-l border-gray-800">
                  <span className="text-purple-400 block text-[10px] uppercase font-extrabold">Forecast (+{minutesAhead}m)</span>
                  <span className="text-purple-300 font-extrabold text-sm mt-0.5 block">{pred.predicted_occupancy} / {pred.capacity}</span>
                </div>
              </div>

              {/* AI Recommendation Chip */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs leading-relaxed space-y-1">
                <span className="font-extrabold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Recommendation:
                </span>
                <p className="text-gray-300 text-[11px] font-medium">{pred.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating IoT Stream Drawer */}
      <IoTActivityDrawer />
    </div>
  );
}

