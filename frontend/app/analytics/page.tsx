"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { api } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { BarChart3, Building2, Users, TrendingUp, ShieldAlert, Award } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalyticsSummary().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <p className="text-xs text-gray-400 text-center py-12">Loading Admin Analytics Engine...</p>;
  }

  const kpi = data.kpis;
  const buildingData = data.building_analytics;
  const peakData = data.peak_hours_data;

  const pieData = [
    { name: "Low Crowd", value: data.crowd_counts.Low, color: "#10B981" },
    { name: "Medium Crowd", value: data.crowd_counts.Medium, color: "#F59E0B" },
    { name: "High Crowd", value: data.crowd_counts.High, color: "#F97316" },
    { name: "Very High Crowd", value: data.crowd_counts["Very High"], color: "#EF4444" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-500" />
          Admin Analytics & Campus Utilization Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Historical & real-time telemetry on building utilization percentages, peak hourly crowd traffic, and maintenance resolution health.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Campus Capacity" value={kpi.total_capacity} subtitle="Total seats available" icon={Building2} color="blue" />
        <StatCard title="Overall Occupancy Rate" value={`${kpi.campus_occupancy_pct}%`} subtitle={`${kpi.current_occupancy} occupants currently`} icon={Users} color="purple" trend="4.2% from yesterday" />
        <StatCard title="Available Rooms" value={kpi.available_rooms} subtitle={`Out of ${kpi.total_rooms} total rooms`} icon={Award} color="emerald" />
        <StatCard title="Open Maintenance Tickets" value={kpi.open_maintenance_reports} subtitle="Requires facility technician" icon={ShieldAlert} color="rose" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Building Utilization Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" /> Building Occupancy Rate (%)
          </h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="code" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF" }}
                />
                <Bar dataKey="occupancy_pct" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours Traffic Curve */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" /> Hourly Campus Traffic Load (%)
          </h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakData}>
                <defs>
                  <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF" }}
                />
                <Area type="monotone" dataKey="occupancy_pct" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorOcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Building Telemetry Table */}
      <div className="glass-panel rounded-3xl p-6 border border-gray-800 space-y-4">
        <h3 className="text-base font-bold text-white">Campus Infrastructure Telemetry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase">
                <th className="py-3 px-4">Building Code</th>
                <th className="py-3 px-4">Building Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Rooms</th>
                <th className="py-3 px-4">Current / Capacity</th>
                <th className="py-3 px-4">Occupancy Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {buildingData.map((b: any) => (
                <tr key={b.building_id} className="hover:bg-slate-900/40 text-gray-200">
                  <td className="py-3 px-4 font-bold text-blue-400">{b.code}</td>
                  <td className="py-3 px-4 font-semibold text-white">{b.name}</td>
                  <td className="py-3 px-4 capitalize text-gray-400">{b.category}</td>
                  <td className="py-3 px-4">{b.room_count}</td>
                  <td className="py-3 px-4">{b.current_occupancy} / {b.total_capacity}</td>
                  <td className="py-3 px-4 font-bold">
                    <span className={`px-2.5 py-1 rounded-full ${
                      b.occupancy_pct > 75 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                      b.occupancy_pct > 50 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {b.occupancy_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
