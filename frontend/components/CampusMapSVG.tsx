"use client";

import React, { useState } from "react";
import {
  Building2,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Navigation,
  Flame,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { useTheme, THEMES } from "./ThemeProvider";

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

  const { theme, playHover, playClick } = useTheme();
  const activeTheme = THEMES[theme] || THEMES.cyber;

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
    playClick();
    setZoomLevel((prev) => Math.min(1.5, Math.max(0.7, prev + delta)));
  };

  const viewBoxWidth = 780 / zoomLevel;
  const viewBoxHeight = 780 / zoomLevel;
  const viewBoxX = (780 - viewBoxWidth) / 2;
  const viewBoxY = (780 - viewBoxHeight) / 2;

  return (
    <div className="relative w-full glass-panel rounded-3xl p-5 border border-white/10 shadow-2xl space-y-4">
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-accent" />
            Virtual Blueprint & IoT Sensor Map
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            Interactive spatial layout with real-time IoT crowd telemetry and node routing.
          </p>
        </div>

        {/* Interactive Viewport & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-white/10 text-xs">
            {[
              { id: "all", label: "All Nodes", icon: Layers },
              { id: "heatmap", label: "Heatmap", icon: Flame },
              { id: "quiet", label: "Quiet", icon: CheckCircle2 },
              { id: "routes", label: "Routes", icon: Navigation },
            ].map((layer) => {
              const Icon = layer.icon;
              const isActive = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onMouseEnter={playHover}
                  onClick={() => {
                    playClick();
                    setActiveLayer(layer.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                    isActive
                      ? "bg-white/10 text-white border border-accent/40 shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-accent" : "text-gray-400"}`} />
                  <span>{layer.label}</span>
                </button>
              );
            })}
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => handleZoom(0.15)}
              onMouseEnter={playHover}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-accent" />
            </button>
            <button
              onClick={() => handleZoom(-0.15)}
              onMouseEnter={playHover}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-accent" />
            </button>
            <button
              onClick={() => {
                playClick();
                setZoomLevel(1);
              }}
              onMouseEnter={playHover}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4 text-accent" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Map Display Box */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 shadow-inner">
        <svg
          viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto max-h-[640px] select-none transition-all duration-300 ease-out cursor-crosshair"
        >
          <defs>
            {/* Cyber Pattern Grid */}
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              <circle cx="40" cy="40" r="1.5" fill={activeTheme.accentHex} opacity="0.3" />
            </pattern>
            {/* Radial Gradient Filter */}
            <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={activeTheme.accentHex} stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#gridPattern)" />

          {/* Central Hub */}
          <circle cx="390" cy="340" r="45" fill="url(#centralGlow)" stroke={activeTheme.accentHex} strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="390" cy="340" r="20" fill={activeTheme.accentHex} fillOpacity="0.15" stroke={activeTheme.accentHex} strokeWidth="2" />
          <text x="390" y="344" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
            Central Plaza
          </text>

          {/* Pedestrian Routes */}
          <g stroke={activeTheme.accentHex} strokeOpacity="0.2" strokeWidth="5" strokeDasharray="8 6" fill="none">
            <path d="M 225 140 L 555 140" />
            <path d="M 175 340 L 610 340" />
            <path d="M 220 535 L 565 535" />
            <path d="M 225 140 L 175 340 L 220 535" />
            <path d="M 555 140 L 610 340 L 565 535" />
          </g>

          {/* Render Building Blueprint Nodes */}
          {buildingNodes.map((node) => {
            const info = getBuildingInfo(node.code);
            const isSelected = selectedBuildingId === info.id;
            const isHovered = hoveredBuilding?.code === node.code;
            const statusColor = getGlowColor(info.occupancy_pct);

            const isRouteOrigin = highlightRouteCode?.originCode === node.code;
            const isRouteDest = highlightRouteCode?.destCode === node.code;
            const isHighlightedRoute = isRouteOrigin || isRouteDest;

            // Filter visibility checks
            if (activeLayer === "quiet" && info.occupancy_pct > 40) return null;
            if (activeLayer === "heatmap" && info.occupancy_pct < 40) return null;

            return (
              <g
                key={node.code}
                onClick={() => {
                  playClick();
                  if (onSelectBuilding) onSelectBuilding(info);
                }}
                onMouseEnter={() => {
                  playHover();
                  setHoveredBuilding(info);
                }}
                onMouseLeave={() => setHoveredBuilding(null)}
                className="cursor-pointer transition-all duration-300"
              >
                {/* Node Glow Border */}
                <rect
                  x={node.x - 4}
                  y={node.y - 4}
                  width={node.width + 8}
                  height={node.height + 8}
                  rx="20"
                  fill="none"
                  stroke={isSelected || isHighlightedRoute ? activeTheme.accentHex : isHovered ? statusColor : "none"}
                  strokeWidth={isSelected || isHighlightedRoute ? "3" : "2"}
                  opacity={isHovered || isSelected || isHighlightedRoute ? "0.9" : "0"}
                  className="transition-all duration-300"
                />

                {/* Main Node Box */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx="16"
                  fill={isHovered ? "rgba(30, 41, 59, 0.95)" : "rgba(15, 23, 42, 0.85)"}
                  stroke={isSelected ? activeTheme.accentHex : "rgba(255, 255, 255, 0.12)"}
                  strokeWidth={isSelected ? "2" : "1"}
                  className="transition-colors duration-200"
                />

                {/* Status Indicator Pill */}
                <rect
                  x={node.x + 14}
                  y={node.y + 14}
                  width="12"
                  height="12"
                  rx="6"
                  fill={statusColor}
                />

                {/* Building Code & Label */}
                <text x={node.x + 34} y={node.y + 25} fill="#F3F4F6" fontSize="13" fontWeight="800">
                  {node.label}
                </text>
                <text x={node.x + 34} y={node.y + 40} fill="#94A3B8" fontSize="10" fontWeight="600" className="font-mono-code">
                  ID: {node.code}
                </text>

                {/* Capacity & Occupancy Meter */}
                <text x={node.x + 14} y={node.y + 68} fill="#CBD5E1" fontSize="11" fontWeight="700">
                  Occupancy: {info.current_occupancy} / {info.total_capacity}
                </text>
                
                {/* Progress bar background */}
                <rect
                  x={node.x + 14}
                  y={node.y + 78}
                  width={node.width - 28}
                  height="7"
                  rx="3.5"
                  fill="rgba(51, 65, 85, 0.6)"
                />
                
                {/* Progress bar fill */}
                <rect
                  x={node.x + 14}
                  y={node.y + 78}
                  width={((node.width - 28) * Math.min(info.occupancy_pct, 100)) / 100}
                  height="7"
                  rx="3.5"
                  fill={statusColor}
                />

                {/* Footer status badges */}
                <text x={node.x + 14} y={node.y + 104} fill={statusColor} fontSize="10" fontWeight="800">
                  ● {getCrowdLevelStr(info.occupancy_pct)} ({Math.round(info.occupancy_pct)}%)
                </text>

                {/* Maintenance Warning Badge if applicable */}
                {info.open_maintenance && info.open_maintenance > 0 ? (
                  <g transform={`translate(${node.x + node.width - 32}, ${node.y + node.height - 30})`}>
                    <circle cx="10" cy="10" r="10" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="1.5" />
                    <text x="10" y="14" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="900">
                      !
                    </text>
                  </g>
                ) : null}

                {/* Route Destination Tag */}
                {isRouteOrigin && (
                  <text x={node.x + node.width - 50} y={node.y + 25} fill="#10B981" fontSize="10" fontWeight="900">
                    [START]
                  </text>
                )}
                {isRouteDest && (
                  <text x={node.x + node.width - 45} y={node.y + 25} fill="#F59E0B" fontSize="10" fontWeight="900">
                    [DEST]
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Info Tooltip Banner */}
      {hoveredBuilding && (
        <div className="p-3 rounded-2xl glass-panel bg-slate-900/90 border border-white/15 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getGlowColor(hoveredBuilding.occupancy_pct) }}
            ></div>
            <div>
              <span className="text-xs font-bold text-white">{hoveredBuilding.name}</span>
              <span className="text-[11px] text-gray-400 ml-2">
                ({hoveredBuilding.current_occupancy} occupants, {hoveredBuilding.room_count} active rooms)
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-accent">Click node to inspect rooms →</span>
        </div>
      )}
    </div>
  );
}
