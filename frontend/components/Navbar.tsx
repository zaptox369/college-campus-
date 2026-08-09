"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPin, DoorOpen, Calendar, Wrench, Navigation, Brain, BarChart3, Search, Command } from "lucide-react";
import CommandPalette from "./CommandPalette";

export default function Navbar() {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Campus Map", href: "/map", icon: MapPin },
    { label: "Rooms", href: "/rooms", icon: DoorOpen },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Maintenance", href: "/maintenance", icon: Wrench },
    { label: "Navigation", href: "/navigation", icon: Navigation },
    { label: "AI Crowd Forecast", href: "/predictions", icon: Brain },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel border-b border-gray-800/80 backdrop-blur-xl bg-slate-950/80">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl tracking-tighter">DT</span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-white via-gray-200 to-blue-300 bg-clip-text text-transparent">
                  Digital Twin Campus
                </span>
                <span className="block text-[9px] uppercase font-bold text-blue-400 tracking-widest">
                  IoT Virtual Twin & AI
                </span>
              </div>
            </Link>

            {/* Nav Items */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Command Palette Search & Live Sync Badge */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-gray-800 hover:border-blue-500/40 text-xs text-gray-400 hover:text-white transition-all shadow-inner"
              >
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline font-medium">Quick Search...</span>
                <span className="flex items-center gap-0.5 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-gray-700 font-mono-code text-gray-300">
                  <Command className="w-2.5 h-2.5" /> K
                </span>
              </button>

              <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-400 hidden sm:inline">IoT Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}

