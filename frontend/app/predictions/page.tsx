"use client";

import React, { useEffect, useState } from "react";
import LiveOccupancyBadge from "@/components/LiveOccupancyBadge";
import { api } from "@/lib/api";
import { Brain, Sparkles, Clock, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            AI Machine Learning Crowd Forecasts
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Random Forest ML model predicting future room crowding, bottleneck spikes, and quiet study times.
          </p>
        </div>

        {/* Forecast Horizon Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto">
          {[15, 30, 60, 120].map((m) => (
            <button
              key={m}
              onClick={() => setMinutesAhead(m)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                minutesAhead === m
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              +{m} mins
            </button>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/40 border border-purple-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Live Forecast Horizon: +{minutesAhead} Minutes</h4>
            <p className="text-xs text-gray-300">Model considers room capacities, historical schedules, active events, and peak hours.</p>
          </div>
        </div>
      </div>

      {/* Forecast Cards Grid */}
      {loading ? (
        <p className="text-xs text-gray-400 text-center py-12">Running Random Forest prediction engine...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((pred) => (
            <div key={pred.room_id} className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4 hover:border-purple-500/40">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                    {pred.building_code} • {pred.building_name}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Room {pred.room_number} {pred.name ? `(${pred.name})` : ""}
                  </h3>
                </div>
                <LiveOccupancyBadge crowdLevel={pred.predicted_crowd_level} occupancyPct={pred.predicted_percentage} />
              </div>

              {/* Current vs Predicted metric */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/70 border border-gray-800 text-center text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Current Occupancy</span>
                  <span className="text-white font-extrabold">{pred.current_occupancy} / {pred.capacity}</span>
                </div>
                <div className="border-l border-gray-800">
                  <span className="text-purple-400 block text-[10px] uppercase font-bold">Predicted (+{minutesAhead}m)</span>
                  <span className="text-purple-300 font-extrabold">{pred.predicted_occupancy} / {pred.capacity}</span>
                </div>
              </div>

              {/* AI Recommendation */}
              <p className="text-xs text-gray-300 bg-purple-950/30 p-3 rounded-xl border border-purple-500/20 leading-relaxed">
                💡 <span className="font-semibold text-purple-200">AI Advice:</span> {pred.recommendation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
