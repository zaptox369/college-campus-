"use client";

import React, { useState } from "react";
import { Building2, Layers, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Sparkles, Navigation, Flame, ShieldAlert, CheckCircle2 } from "lucide-react";

interface BuildingData {
  id: number;
  code: string;
  name: string;
  category: string;
  room_count: number;
  total_capacity: number;
  current_occupancy: number;
  occupancy_pct: number;
  open_maintenance?: number;
}

interface CampusMapSVGProps {
  buildings: BuildingData[];
  onSelectBuilding?: (building: BuildingData) => void;
  selectedBuildingId?: number | null;
  highlightRouteCode?: { originCode?: string; destCode?: string };
}

export default function CampusMapSVG({
  buildings,
  onSelectBuilding,
  selectedBuildingId,
  highlightRouteCode,
}: CampusMapSVGProps) {
  const [hoveredBuilding, setHoveredBuilding] = useState<BuildingData | null>(null);
  const [activeLayer, setActiveLayer] = useState<"all" | "heatmap" | "quiet" | "maintenance" | "routes">("all");
  const [zoomLevel, setZoomLevel] = useState(1);

  // Coordinates & node layouts for campus blueprint
  const buildingNodes = [
    { code: "ACAD_A", x: 110, y: 70, width: 230, height: 140, label: "Academic Block A" },
    { code: "ACAD_B", x: 440, y: 70, width: 230, height: 140, label: "Academic Block B" },
    { code: "LIB", x: 70, y: 270, width: 210, height: 140, label: "Central Library" },
    { code: "LAB_HUB", x: 500, y: 270, width: 220, height: 140, label: "Innovation & Tech Hub" },
    { code: "SC_CAFE", x: 110, y: 470, width: 220, height: 130, label: "Student Cafe & Hub" },
    { code: "AUD", x: 450, y: 470, width: 230, height: 130, label: "Grand Auditorium" },
    { code: "SPORTS", x: 290, y: 630, width: 210, height: 110, label: "Sports & Athletics" },
  ];

  const getBuildingInfo = (code: string): BuildingData => {
    const found = buildings.find((b) => b.code === code);
    if (found) return found;
    return {
      id: 0,
      code,
      name: code,
      category: "academic",
      room_count: 5,
      total_capacity: 150,
      current_occupancy: 45,
      occupancy_pct: 30,
      open_maintenance: code === "ACAD_A" ? 1 : 0,
    };
  };

  const getGlowColor = (pct: number) => {
    if (pct < 40) return "#10B981"; // Emerald
    if (pct < 70) return "#F59E0B"; // Amber
    if (pct < 90) return "#F97316"; // Orange
    return "#EF4444"; // Rose
  };

  const getCrowdLevelStr = (pct: number) => {
    if (pct < 40) return "Low Crowd";
    if (pct < 70) return "Medium Crowd";
    if (pct < 90) return "High Crowd";
    return "Very High";
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.4, Math.max(0.8, prev + delta)));
  };

  // Base viewBox calculation for zoom
  const viewBoxWidth = 780 / zoomLevel;
  const viewBoxHeight = 780 / zoomLevel;
  const viewBoxX = (780 - viewBoxWidth) / 2;
  const viewBoxY = (780 - viewBoxHeight) / 2;

  return (
    <div className="relative w-full glass-panel rounded-3xl p-5 border border-blue-500/20 shadow-2xl space-y-4">
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-400" />
            Virtual Blueprint & IoT Sensor Map
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Interactive IoT spatial node map with live crowd heatmaps and route tracing.
          </p>
        </div>

        {/* Interactive Viewport & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-gray-800 text-xs">
            <button
              onClick={() => setActiveLayer("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeLayer === "all" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              All Nodes
            </button>
            <button
              onClick={() => setActiveLayer("heatmap")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                activeLayer === "heatmap" ? "bg-amber-600 text-white shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Heatmap
            </button>
            <button
              onClick={() => setActiveLayer("quiet")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                activeLayer === "quiet" ? "bg-emerald-600 text-white shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Quiet Zones
            </button>
            <button
              onClick={() => setActiveLayer("routes")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                activeLayer === "routes" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" /> Routes
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-gray-800">
            <button
              onClick={() => handleZoom(0.15)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Map Display Box */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-800/80 bg-slate-950/80 shadow-inner">
        <svg
          viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto max-h-[640px] select-none transition-all duration-300 ease-out cursor-crosshair"
        >
          <defs>
            {/* Cyber Pattern Grid */}
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              <circle cx="40" cy="40" r="1.5" fill="rgba(59, 130, 246, 0.2)" />
            </pattern>
            {/* Glowing Gradient Filters */}
            <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
              <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#gridPattern)" />

          {/* Central Courtyard & Fountain Hub */}
          <circle cx="390" cy="340" r="45" fill="url(#centralGlow)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" />
          <circle cx="390" cy="340" r="20" fill="rgba(59, 130, 246, 0.15)" stroke="#3B82F6" strokeWidth="2" />
          <text x="390" y="344" textAnchor="middle" fill="#60A5FA" fontSize="10" fontWeight="bold">
            Central Plaza Hub
          </text>

          {/* Pedestrian Pathways & Routes */}
          <g stroke="rgba(59, 130, 246, 0.2)" strokeWidth="6" strokeDasharray="8 6" fill="none">
            <path d="M 225 140 L 555 140" />
            <path d="M 175 340 L 610 340" />
            <path d="M 220 535 L 565 535" />
            <path d="M 225 140 L 175 340 L 220 535" />
            <path d="M 555 140 L 610 340 L 565 535" />
            <path d="M 390 340 L 395 685" />
          </g>

          {/* Active Highlighted Route path if routes layer or props enabled */}
          {(activeLayer === "routes" || highlightRouteCode) && (
            <g stroke="#3B82F6" strokeWidth="6" strokeDasharray="10 8" fill="none" className="animate-dash-flow">
              <path d="M 225 140 L 390 340 L 610 340" stroke="#60A5FA" />
            </g>
          )}

          {/* Render Buildings Nodes */}
          {buildingNodes.map((node) => {
            const info = getBuildingInfo(node.code);
            const isSelected = selectedBuildingId === info.id;
            const glowColor = getGlowColor(info.occupancy_pct);

            // Layer Filtering logic
            let isDimmed = false;
            if (activeLayer === "heatmap" && info.occupancy_pct < 70) isDimmed = true;
            if (activeLayer === "quiet" && info.occupancy_pct >= 40) isDimmed = true;

            return (
              <g
                key={node.code}
                className={`cursor-pointer transition-all duration-300 ${isDimmed ? "opacity-30" : "opacity-100"}`}
                onClick={() => onSelectBuilding && onSelectBuilding(info)}
                onMouseEnter={() => setHoveredBuilding(info)}
                onMouseLeave={() => setHoveredBuilding(null)}
              >
                {/* Concentric IoT Radar Pulsing Ring */}
                <circle
                  cx={node.x + node.width / 2}
                  cy={node.y + node.height / 2}
                  r="70"
                  fill="none"
                  stroke={glowColor}
                  strokeWidth="1.5"
                  opacity="0.25"
                  className="animate-pulse"
                />

                {/* Outer Glow Rectangle */}
                <rect
                  x={node.x - 5}
                  y={node.y - 5}
                  width={node.width + 10}
                  height={node.height + 10}
                  rx="22"
                  fill={glowColor}
                  opacity={isSelected ? 0.45 : activeLayer === "heatmap" ? 0.35 : 0.12}
                  className="transition-all duration-300"
                />

                {/* Main Card Container */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx="18"
                  fill="#0F172A"
                  stroke={isSelected ? "#3B82F6" : glowColor}
                  strokeWidth={isSelected ? "3" : "1.8"}
                  className="filter drop-shadow-xl hover:fill-slate-900 transition-colors"
                />

                {/* Header Badge */}
                <rect
                  x={node.x + 14}
                  y={node.y + 12}
                  width={58}
                  height={22}
                  rx="8"
                  fill={glowColor}
                  opacity="0.2"
                />
                <text
                  x={node.x + 43}
                  y={node.y + 27}
                  textAnchor="middle"
                  fill={glowColor}
                  fontSize="11"
                  fontWeight="bold"
                >
                  {node.code}
                </text>

                {/* Maintenance Alert Icon on Map if open maintenance */}
                {info.open_maintenance && info.open_maintenance > 0 && (
                  <g transform={`translate(${node.x + node.width - 32}, ${node.y + 12})`}>
                    <circle cx="10" cy="10" r="10" fill="#EF4444" opacity="0.9" />
                    <text x="10" y="14" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">!</text>
                  </g>
                )}

                {/* Building Name */}
                <text
                  x={node.x + 16}
                  y={node.y + 56}
                  fill="#FFFFFF"
                  fontSize="13"
                  fontWeight="800"
                >
                  {node.label}
                </text>

                {/* Occupancy Progress Bar */}
                <rect
                  x={node.x + 16}
                  y={node.y + 68}
                  width={node.width - 32}
                  height="7"
                  rx="3.5"
                  fill="#1E293B"
                />
                <rect
                  x={node.x + 16}
                  y={node.y + 68}
                  width={Math.max(4, ((node.width - 32) * Math.min(100, info.occupancy_pct)) / 100)}
                  height="7"
                  rx="3.5"
                  fill={glowColor}
                />

                {/* Metrics */}
                <text x={node.x + 16} y={node.y + 94} fill="#94A3B8" fontSize="11" fontWeight="500">
                  Occ: {info.current_occupancy}/{info.total_capacity} ({info.occupancy_pct}%)
                </text>

                <text x={node.x + 16} y={node.y + 114} fill="#60A5FA" fontSize="11" fontWeight="600">
                  {info.room_count} Rooms • {getCrowdLevelStr(info.occupancy_pct)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-gray-800">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-300">Live Crowd Index:</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> &lt;40% (Low)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 40-70% (Medium)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 70-90% (High)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> &gt;90% (Very High)</span>
        </div>
        <div className="text-[11px] text-gray-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Click any building to view rooms
        </div>
      </div>
    </div>
  );
}
