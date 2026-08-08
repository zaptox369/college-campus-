"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Navigation, MapPin, ArrowRight, Clock, Footprints, CheckCircle2 } from "lucide-react";

export default function NavigationPage() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [originId, setOriginId] = useState<string>("");
  const [destId, setDestId] = useState<string>("");
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBuildings().then((data) => {
      setBuildings(data);
      if (data.length >= 2) {
        setOriginId(data[0].id.toString());
        setDestId(data[2].id.toString());
      }
      setLoading(false);
    });
  }, []);

  const handleCalculateRoute = async () => {
    if (!originId || !destId) return;
    try {
      const res = await api.getRoute(parseInt(originId), parseInt(destId));
      setRoute(res);
    } catch (err) {
      console.error("Error fetching campus route", err);
    }
  };

  useEffect(() => {
    if (originId && destId) {
      handleCalculateRoute();
    }
  }, [originId, destId]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Navigation className="w-8 h-8 text-blue-500" />
          Smart Campus Navigation & Route Engine
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Calculate shortest pedestrian paths, estimated walking time, and accessible routes between campus blocks.
        </p>
      </div>

      {/* Route Selector Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin Select */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Starting Location (Origin)
            </label>
            <select
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Select */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" /> Destination Location
            </label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Route Result Card */}
      {route && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Route Summary</span>
              <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-3">
                <span>{route.origin.name}</span>
                <ArrowRight className="w-6 h-6 text-gray-500" />
                <span>{route.destination.name}</span>
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 uppercase block">Distance</span>
                <span className="text-lg font-black text-white flex items-center gap-1">
                  <Footprints className="w-4 h-4 text-blue-400" /> {route.distance_meters}m
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 uppercase block">Walking Time</span>
                <span className="text-lg font-black text-emerald-400 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-400" /> ~{route.estimated_walking_time_mins} mins
                </span>
              </div>
            </div>
          </div>

          {/* Accessible Route pill */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl w-fit">
            <CheckCircle2 className="w-4 h-4" /> Wheelchair & Ramp Accessible Pedestrian Path
          </div>

          {/* Step-by-Step Directions */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step-by-Step Directions</h3>
            <div className="space-y-3">
              {route.steps.map((step: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/60 border border-gray-800">
                  <div className="w-7 h-7 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-gray-200 mt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
