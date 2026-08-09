"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import CampusMapSVG from "@/components/CampusMapSVG";
import MaintenanceModal from "@/components/MaintenanceModal";
import IoTActivityDrawer from "@/components/IoTActivityDrawer";
import { api } from "@/lib/api";
import { connectWebSocket } from "@/lib/websocket";
import {
  DoorOpen,
  Users,
  Calendar,
  Wrench,
  Sparkles,
  MapPin,
  Navigation,
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [maintenanceReports, setMaintenanceReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [summaryRes, eventsRes, maintRes] = await Promise.all([
        api.getAnalyticsSummary(),
        api.getEvents(),
        api.getMaintenanceReports(),
      ]);
      setAnalytics(summaryRes);
      setEvents(eventsRes.slice(0, 3));
      setMaintenanceReports(maintRes.slice(0, 3));
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Listen to real-time WebSocket room updates
    const cleanupWS = connectWebSocket((msg) => {
      if (msg.type === "ROOM_UPDATE") {
        api.getAnalyticsSummary().then((res) => setAnalytics(res));
      }
    });

    return () => cleanupWS();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center animate-spin">
          <Zap className="w-7 h-7 text-blue-400" />
        </div>
        <p className="text-sm font-bold text-gray-400 tracking-wide">Syncing Digital Twin Campus IoT Telemetry...</p>
      </div>
    );
  }

  const kpi = analytics.kpis;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-950/80 border border-blue-500/30 relative overflow-hidden shadow-2xl">
        {/* Glow backdrop circles */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Virtual Twin Platform v2.0
              </span>
              <span className="text-xs text-gray-400 hidden sm:inline">• Live IoT Telemetry & ML Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Campus Operations & Digital Twin
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl mt-2 leading-relaxed font-medium">
              Monitor real-time room availability, crowd density indices, campus events, maintenance tickets, and AI room demand predictions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsMaintenanceOpen(true)}
              className="px-4 py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition-all flex items-center gap-2 shadow-lg"
            >
              <Wrench className="w-4 h-4" /> Report Issue
            </button>
            <Link
              href="/map"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Launch Interactive Blueprint
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Available Rooms"
          value={kpi.available_rooms}
          subtitle={`Out of ${kpi.total_rooms} campus rooms`}
          icon={DoorOpen}
          color="emerald"
        />
        <StatCard
          title="Current Occupancy"
          value={`${kpi.current_occupancy} / ${kpi.total_capacity}`}
          subtitle={`Campus Crowd: ${kpi.campus_occupancy_pct}%`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Events Today"
          value={kpi.active_events}
          subtitle="Keynotes, labs & workshops"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Maintenance Tickets"
          value={kpi.open_maintenance_reports}
          subtitle="Facility support issues"
          icon={Wrench}
          color="amber"
        />
      </div>

      {/* Interactive Blueprint & Selected Building Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CampusMapSVG
            buildings={analytics.building_analytics}
            selectedBuildingId={selectedBuilding?.id}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
          />
        </div>

        {/* Side Panel: Selected Building & Crowd Classification */}
        <div className="space-y-6">
          {/* Selected Building Details Card */}
          <div className="glass-panel p-6 rounded-3xl border border-blue-500/20 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              {selectedBuilding ? selectedBuilding.name : "Select a Building Node"}
            </h3>
            <p className="text-xs text-gray-400">
              {selectedBuilding ? `Category: ${selectedBuilding.category}` : "Click any node on the blueprint to inspect real-time room stats."}
            </p>

            {selectedBuilding ? (
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-gray-800 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-400">Total Capacity:</span>
                    <span className="text-white font-bold">{selectedBuilding.total_capacity} seats</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-400">Current Occupancy:</span>
                    <span className="text-blue-400 font-bold">{selectedBuilding.current_occupancy} ({selectedBuilding.occupancy_pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${selectedBuilding.occupancy_pct}%` }}
                    ></div>
                  </div>
                </div>

                <Link
                  href={`/rooms?building_id=${selectedBuilding.id}`}
                  className="w-full py-3 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold text-xs hover:bg-blue-600/30 transition-all flex items-center justify-center gap-2 shadow-inner"
                >
                  Explore {selectedBuilding.name} Rooms <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-dashed border-gray-800 text-center">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Click Academic Block A, Library, Innovation Labs, or Auditorium from the map to inspect capacity.
                </p>
              </div>
            )}
          </div>

          {/* Crowd Distribution Breakdown */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Live Room Crowd Classification
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 font-bold">Low Crowd (&lt;40%)</span>
                <span className="text-white font-black">{analytics.crowd_counts.Low} Rooms</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-400 font-bold">Medium Crowd (40-70%)</span>
                <span className="text-white font-black">{analytics.crowd_counts.Medium} Rooms</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                <span className="text-orange-400 font-bold">High Crowd (70-90%)</span>
                <span className="text-white font-black">{analytics.crowd_counts.High} Rooms</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-400 font-bold">Very High Crowd (&gt;90%)</span>
                <span className="text-white font-black">{analytics.crowd_counts["Very High"]} Rooms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events & Maintenance Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Events Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Upcoming Campus Events
            </h3>
            <Link href="/events" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="p-4 rounded-2xl bg-slate-950/60 border border-gray-800/80 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md">
                    {e.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{e.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">📍 {e.location_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-300">
                    {new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" /> Facilities & Maintenance
            </h3>
            <Link href="/maintenance" className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
              Manage Board <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {maintenanceReports.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-950/60 border border-gray-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      m.priority === "High" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                      m.priority === "Medium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {m.priority} Priority
                    </span>
                    <span className="text-xs text-gray-400">📍 {m.location}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1.5">{m.title}</h4>
                </div>
                <span className="text-xs font-bold text-gray-300 bg-slate-900 border border-gray-800 px-3 py-1 rounded-xl">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating IoT Real-time Stream Widget */}
      <IoTActivityDrawer />

      {/* Maintenance Modal */}
      <MaintenanceModal
        isOpen={isMaintenanceOpen}
        onClose={() => setIsMaintenanceOpen(false)}
        onSuccess={() => loadDashboardData()}
      />
    </div>
  );
}

