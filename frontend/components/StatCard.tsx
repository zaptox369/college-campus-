"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "blue" | "emerald" | "amber" | "rose" | "purple";
  trend?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
}: StatCardProps) {
  const { playHover } = useTheme();

  const colorMap = {
    blue: "from-blue-500/20 via-cyan-500/10 to-transparent text-cyan-400 border-cyan-500/30 hover:border-cyan-500/60 shadow-cyan-500/10",
    emerald: "from-emerald-500/20 via-teal-500/10 to-transparent text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60 shadow-emerald-500/10",
    amber: "from-amber-500/20 via-orange-500/10 to-transparent text-amber-400 border-amber-500/30 hover:border-amber-500/60 shadow-amber-500/10",
    rose: "from-rose-500/20 via-red-500/10 to-transparent text-rose-400 border-rose-500/30 hover:border-rose-500/60 shadow-rose-500/10",
    purple: "from-purple-500/20 via-violet-500/10 to-transparent text-purple-300 border-purple-500/30 hover:border-purple-500/60 shadow-purple-500/10",
  };

  return (
    <div
      onMouseEnter={playHover}
      className={`p-6 rounded-2xl bg-gradient-to-br ${colorMap[color]} border glass-panel relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group`}
    >
      {/* Background sheen reflection effect */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl sm:text-4xl font-black text-white mt-1.5 tracking-tight group-hover:scale-105 transition-transform origin-left">
            {value}
          </h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>}
          {trend && (
            <span className="inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              ↑ {trend}
            </span>
          )}
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 text-accent group-hover:rotate-6 transition-transform shadow-inner">
          <Icon className="w-6 h-6 text-white group-hover:text-accent transition-colors" />
        </div>
      </div>
    </div>
  );
}
