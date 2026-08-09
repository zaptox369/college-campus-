"use client";

import React, { useEffect, useState } from "react";
import CampusMapSVG from "@/components/CampusMapSVG";
import IoTActivityDrawer from "@/components/IoTActivityDrawer";
import { api } from "@/lib/api";
import { Navigation, MapPin, ArrowRight, Clock, Footprints, CheckCircle2, Play, Pause, RotateCcw, ShieldCheck, Zap } from "lucide-react";

export default function NavigationPage() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [originId, setOriginId] = useState<string>("");
  const [destId, setDestId] = useState<string>("");
  const [route, setRoute] = useState<any>(null);
  const [routePreference, setRoutePreference] = useState<"fastest" | "accessible" | "quiet">("fastest");
  const [loading, setLoading] = useState(true);

  // Live Navigation Simulation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

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
      setIsNavigating(false);
      setCurrentStepIdx(0);
    } catch (err) {
      console.error("Error fetching campus route", err);
    }
  };

  useEffect(() => {
    if (originId && destId) {
      handleCalculateRoute();
    }
  }, [originId, destId]);

  // Handle simulation timer
  useEffect(() => {
    let interval: any = null;
    if (isNavigating && route && route.steps) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < route.steps.length - 1) return prev + 1;
          setIsNavigating(false);
          return prev;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isNavigating, route]);

  const originBuilding = buildings.find((b) => b.id.toString() === originId);
  const destBuilding = buildings.find((b) => b.id.toString() === destId);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <Navigation className="w-9 h-9 text-blue-500" />
          Smart Campus Navigation & Route Engine
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Calculate shortest pedestrian paths, estimated walking time, accessible routes, and simulate live walking navigation between campus blocks.
        </p>
      </div>

      {/* Route Controls & Options */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/20 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin Select */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Starting Location (Origin Node)
            </label>
            <select
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none font-semibold"
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
            <label className="block text-xs font-bold text-gray-300 uppercase mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" /> Destination Block
            </label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none font-semibold"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Route Preference Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800/80">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-400 font-semibold mr-1">Route Preference:</span>
            <button
              onClick={() => setRoutePreference("fastest")}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                routePreference === "fastest" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-950 text-gray-400 hover:text-white border border-gray-800"
              }`}
            >
              🚀 Fastest Pedestrian Path
            </button>
            <button
              onClick={() => setRoutePreference("accessible")}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                routePreference === "accessible" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-950 text-gray-400 hover:text-white border border-gray-800"
              }`}
            >
              ♿ Wheelchair & Ramp Accessible
            </button>
            <button
              onClick={() => setRoutePreference("quiet")}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                routePreference === "quiet" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-950 text-gray-400 hover:text-white border border-gray-800"
              }`}
            >
              🌿 Low-Crowd Quiet Scenic Route
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Campus Blueprint Map + Step-by-Step Directions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SVG Blueprint Sync */}
        <div className="lg:col-span-2 space-y-4">
          <CampusMapSVG
            buildings={buildings}
            highlightRouteCode={{
              originCode: originBuilding?.code,
              destCode: destBuilding?.code,
            }}
          />
        </div>

        {/* Directions & Navigation Simulator */}
        {route && (
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Route Summary */}
              <div className="border-b border-gray-800 pb-4">
                <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider block">Live Path Calculation</span>
                <h3 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                  <span>{route.origin.name}</span>
                  <ArrowRight className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>{route.destination.name}</span>
                </h3>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-gray-800 text-center">
                    <span className="text-[10px] text-gray-400 uppercase block font-semibold">Distance</span>
                    <span className="text-base font-black text-white flex items-center justify-center gap-1 mt-0.5">
                      <Footprints className="w-4 h-4 text-blue-400" /> {route.distance_meters}m
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-gray-800 text-center">
                    <span className="text-[10px] text-gray-400 uppercase block font-semibold">Walk Time</span>
                    <span className="text-base font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="w-4 h-4 text-emerald-400" /> ~{route.estimated_walking_time_mins} mins
                    </span>
                  </div>
                </div>
              </div>

              {/* Simulation Start / Pause Control */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Walking Simulator
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsNavigating(!isNavigating)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                        isNavigating
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
                      }`}
                    >
                      {isNavigating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {isNavigating ? "Pause Navigation" : "Start Live Walking"}
                    </button>

                    <button
                      onClick={() => {
                        setIsNavigating(false);
                        setCurrentStepIdx(0);
                      }}
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg bg-gray-800/80 transition-colors"
                      title="Reset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-400 font-semibold">
                    <span>Progress</span>
                    <span>
                      Step {currentStepIdx + 1} of {route.steps.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                      style={{
                        width: `${((currentStepIdx + 1) / route.steps.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Guidance */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Step-by-Step Directions</h4>
                {route.steps.map((step: string, idx: number) => {
                  const isActiveStep = idx === currentStepIdx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl transition-all ${
                        isActiveStep
                          ? "bg-blue-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/10 scale-[1.02]"
                          : "bg-slate-950/60 border border-gray-800/80"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          isActiveStep
                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/40"
                            : "bg-gray-800/80 text-gray-400"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${isActiveStep ? "text-white font-bold" : "text-gray-300"}`}>
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating IoT Activity Drawer */}
      <IoTActivityDrawer />
    </div>
  );
}

