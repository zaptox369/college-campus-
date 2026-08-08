"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import CampusMapSVG from "@/components/CampusMapSVG";
import MaintenanceModal from "@/components/MaintenanceModal";
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
        console.log("Live room update received:", msg);
        // Refresh KPI summary seamlessly
        api.getAnalyticsSummary().then((res) => setAnalytics(res));
      }
    });

    return () => cleanupWS();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center animate-spin">
          <Zap className="w-6 h-6 text-blue-400" />
        </div>
        <p className="text-sm font-semibold text-gray-400">Syncing Digital Twin Campus State...</p>
      </div>
    );
  }

  const kpi = analytics.kpis;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-blue-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Virtual Twin Platform v1.0
              </span>
              <span className="text-xs text-gray-400">• Real-Time IoT & ML Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Campus Operations & Digital Twin
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl mt-2 leading-relaxed">
              Monitor live room availability, occupancy crowd indices, scheduled campus events, facility maintenance issues, and AI-predicted room demand in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsMaintenanceOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition-all flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" /> Report Issue
            </button>
            <Link
              href="/map"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" /> View Interactive Map
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Available Rooms"
          value={kpi.available_rooms}
          subtitle={`Out of ${kpi.total_rooms} total campus rooms`}
          icon={DoorOpen}
          color="emerald"
        />
        <StatCard
          title="Current Occupancy"
          value={`${kpi.current_occupancy} / ${kpi.total_capacity}`}
          subtitle={`Campus Crowd Level: ${kpi.campus_occupancy_pct}%`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Events Today"
          value={kpi.active_events}
          subtitle="Keynotes, workshops & sports"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Maintenance Issues"
          value={kpi.open_maintenance_reports}
          subtitle="Open support tickets"
          icon={Wrench}
          color="amber"
        />
      </div>

      {/* Interactive Blueprint & Selected Building Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CampusMapSVG
            buildings={analytics.building_analytics}
            selectedBuildingId={selectedBuilding?.id}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
          />
        </div>

        {/* Side Panel: Selected Building / Real-time Crowd Breakdown */}
        <div className="space-y-6">
          {/* Quick Selected Building Info */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              {selectedBuilding ? selectedBuilding.name : "Select a Building on Map"}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {selectedBuilding ? `Category: ${selectedBuilding.category}` : "Click any building node to see immediate room & occupancy breakdown."}
            </p>

            {selectedBuilding ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-gray-800 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-400">Total Capacity:</span>
                    <span className="text-white">{selectedBuilding.total_capacity} seats</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-400">Current Occupancy:</span>
                    <span className="text-blue-400">{selectedBuilding.current_occupancy} ({selectedBuilding.occupancy_pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${selectedBuilding.occupancy_pct}%` }}
                    ></div>
                  </div>
                </div>

                <Link
                  href={`/rooms?building_id=${selectedBuilding.id}`}
                  className="w-full py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold text-xs hover:bg-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  Inspect {selectedBuilding.name} Rooms <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-gray-800 text-center">
                <p className="text-xs text-gray-400">
                  Select Academic Block A, Library, Innovation Labs, or Cafeteria from the blueprint on the left.
                </p>
              </div>
            )}
          </div>

          {/* Crowd Distribution Card */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Live Room Crowd Classification
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 font-semibold">Low Crowd (&lt;40%)</span>
                <span className="text-white font-extrabold">{analytics.crowd_counts.Low} Rooms</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-400 font-semibold">Medium Crowd (40-70%)</span>
                <span className="text-white font-extrabold">{analytics.crowd_counts.Medium} Rooms</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <span className="text-orange-400 font-semibold">High Crowd (70-90%)</span>
                <span className="text-white font-extrabold">{analytics.crowd_counts.High} Rooms</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-400 font-semibold">Very High Crowd (&gt;90%)</span>
                <span className="text-white font-extrabold">{analytics.crowd_counts["Very High"]} Rooms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events & Maintenance Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Events Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Upcoming Campus Events
            </h3>
            <Link href="/events" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="p-4 rounded-2xl bg-slate-900/60 border border-gray-800 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                    {e.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{e.title}</h4>
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
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" /> Facilities & Maintenance
            </h3>
            <Link href="/maintenance" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
              Manage Board <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {maintenanceReports.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-900/60 border border-gray-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      m.priority === "High" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                      m.priority === "Medium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {m.priority} Priority
                    </span>
                    <span className="text-xs text-gray-400">📍 {m.location}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{m.title}</h4>
                </div>
                <span className="text-xs font-bold text-gray-300 bg-gray-800 px-3 py-1 rounded-xl">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance Modal */}
      <MaintenanceModal
        isOpen={isMaintenanceOpen}
        onClose={() => setIsMaintenanceOpen(false)}
        onSuccess={() => loadDashboardData()}
      />
    </div>
  );
}
