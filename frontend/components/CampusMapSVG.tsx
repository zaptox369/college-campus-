"use client";

import React, { useState } from "react";
import LiveOccupancyBadge from "./LiveOccupancyBadge";
import { Building2, Users, DoorOpen, ArrowRight } from "lucide-react";

interface BuildingData {
  id: number;
  code: string;
  name: string;
  category: string;
  room_count: number;
  total_capacity: number;
  current_occupancy: number;
  occupancy_pct: number;
}

interface CampusMapSVGProps {
  buildings: BuildingData[];
  onSelectBuilding?: (building: BuildingData) => void;
  selectedBuildingId?: number | null;
}

export default function CampusMapSVG({ buildings, onSelectBuilding, selectedBuildingId }: CampusMapSVGProps) {
  const [hoveredBuilding, setHoveredBuilding] = useState<BuildingData | null>(null);

  // Map coordinates and layout layout for 7 campus nodes
  const buildingNodes = [
    { code: "ACAD_A", x: 120, y: 80, width: 220, height: 140, label: "Academic Block A" },
    { code: "ACAD_B", x: 440, y: 80, width: 220, height: 140, label: "Academic Block B" },
    { code: "LIB", x: 80, y: 280, width: 200, height: 140, label: "Central Library" },
    { code: "LAB_HUB", x: 500, y: 280, width: 220, height: 140, label: "Innovation & Tech Labs" },
    { code: "SC_CAFE", x: 120, y: 480, width: 210, height: 130, label: "Student Union & Cafe" },
    { code: "AUD", x: 450, y: 480, width: 220, height: 130, label: "Grand Auditorium" },
    { code: "SPORTS", x: 300, y: 640, width: 200, height: 110, label: "Sports Complex" },
  ];

  const getBuildingInfo = (code: string) => {
    return buildings.find((b) => b.code === code) || {
      id: 0,
      code,
      name: code,
      category: "academic",
      room_count: 0,
      total_capacity: 100,
      current_occupancy: 0,
      occupancy_pct: 0,
    };
  };

  const getGlowColor = (pct: number) => {
    if (pct < 40) return "#10B981"; // Emerald
    if (pct < 70) return "#F59E0B"; // Amber
    if (pct < 90) return "#F97316"; // Orange
    return "#EF4444"; // Rose
  };

  const getCrowdLevelStr = (pct: number) => {
    if (pct < 40) return "Low";
    if (pct < 70) return "Medium";
    if (pct < 90) return "High";
    return "Very High";
  };

  return (
    <div className="relative w-full glass-panel rounded-3xl p-4 sm:p-6 overflow-hidden border border-gray-800">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Interactive Virtual Campus Blueprint
          </h2>
          <p className="text-xs text-gray-400">
            Click any building to inspect live rooms, status, and crowd distribution.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-gray-800">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> &lt;40% (Low)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 40-70% (Med)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 70-90% (High)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> &gt;90% (Very High)</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox="0 0 780 780"
          className="w-full h-auto max-h-[700px] select-none bg-slate-950/60 rounded-2xl border border-gray-800/80"
        >
          {/* Background Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Pedestrian Pathways & Roads */}
          <g stroke="rgba(59, 130, 246, 0.25)" strokeWidth="6" strokeDasharray="8 6" fill="none">
            {/* Horizontal connects */}
            <path d="M 230 150 L 550 150" />
            <path d="M 180 350 L 610 350" />
            <path d="M 225 545 L 560 545" />

            {/* Vertical connects */}
            <path d="M 230 150 L 180 350 L 225 545" />
            <path d="M 550 150 L 610 350 L 560 545" />
            <path d="M 400 350 L 400 695" />
          </g>

          {/* Central Courtyard & Fountain Visual */}
          <circle cx="400" cy="350" r="35" fill="rgba(59, 130, 246, 0.1)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
          <text x="400" y="354" textAnchor="middle" fill="#60A5FA" fontSize="10" fontWeight="bold">
            Central Plaza
          </text>

          {/* Render Buildings */}
          {buildingNodes.map((node) => {
            const info = getBuildingInfo(node.code);
            const isSelected = selectedBuildingId === info.id;
            const glowColor = getGlowColor(info.occupancy_pct);

            return (
              <g
                key={node.code}
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectBuilding && onSelectBuilding(info)}
                onMouseEnter={() => setHoveredBuilding(info)}
                onMouseLeave={() => setHoveredBuilding(null)}
              >
                {/* Outer Glow Area */}
                <rect
                  x={node.x - 4}
                  y={node.y - 4}
                  width={node.width + 8}
                  height={node.height + 8}
                  rx="20"
                  fill={glowColor}
                  opacity={isSelected ? 0.4 : 0.15}
                  className="transition-all duration-300"
                />

                {/* Building Main Container */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx="16"
                  fill="#1E293B"
                  stroke={isSelected ? "#3B82F6" : glowColor}
                  strokeWidth={isSelected ? "3" : "2"}
                  className="filter drop-shadow-md hover:fill-slate-800 transition-colors"
                />

                {/* Header Tag */}
                <rect
                  x={node.x + 12}
                  y={node.y + 12}
                  width={50}
                  height={20}
                  rx="6"
                  fill={glowColor}
                  opacity="0.2"
                />
                <text
                  x={node.x + 37}
                  y={node.y + 26}
                  textAnchor="middle"
                  fill={glowColor}
                  fontSize="11"
                  fontWeight="bold"
                >
                  {node.code}
                </text>

                {/* Building Title */}
                <text
                  x={node.x + 16}
                  y={node.y + 55}
                  fill="#FFFFFF"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {node.label}
                </text>

                {/* Occupancy Progress Bar */}
                <rect
                  x={node.x + 16}
                  y={node.y + 68}
                  width={node.width - 32}
                  height="8"
                  rx="4"
                  fill="#0F172A"
                />
                <rect
                  x={node.x + 16}
                  y={node.y + 68}
                  width={Math.max(4, ((node.width - 32) * Math.min(100, info.occupancy_pct)) / 100)}
                  height="8"
                  rx="4"
                  fill={glowColor}
                />

                {/* Substats */}
                <text x={node.x + 16} y={node.y + 94} fill="#94A3B8" fontSize="11">
                  Occ: {info.current_occupancy}/{info.total_capacity} ({info.occupancy_pct}%)
                </text>

                <text x={node.x + 16} y={node.y + 114} fill="#60A5FA" fontSize="11" fontWeight="500">
                  {info.room_count} Rooms • {getCrowdLevelStr(info.occupancy_pct)} Crowd
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
