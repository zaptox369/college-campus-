"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPin, DoorOpen, Calendar, Wrench, Navigation, Brain, BarChart3 } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

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
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800 backdrop-blur-md bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">DT</span>
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Digital Twin Campus
              </span>
              <span className="block text-[10px] uppercase font-semibold text-blue-400 tracking-wider">
                Virtual Operations & AI Engine
              </span>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Live Status Badge */}
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400">Live Sync</span>
          </div>
        </div>
      </div>
    </header>
  );
}
