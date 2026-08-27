"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  DoorOpen,
  Calendar,
  Wrench,
  Navigation,
  Brain,
  BarChart3,
  Search,
  Command,
  Palette,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Check,
} from "lucide-react";
import CommandPalette from "./CommandPalette";
import { useTheme, THEMES, ThemeMode } from "./ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { theme, setTheme, soundEnabled, setSoundEnabled, playHover, playClick } = useTheme();
  const activeThemeConfig = THEMES[theme] || THEMES.cyber;

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Campus Map", href: "/map", icon: MapPin },
    { label: "Rooms", href: "/rooms", icon: DoorOpen },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Maintenance", href: "/maintenance", icon: Wrench },
    { label: "Navigation", href: "/navigation", icon: Navigation },
    { label: "AI Forecast", href: "/predictions", icon: Brain },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 backdrop-blur-xl bg-slate-950/80 transition-all duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <Link
              href="/"
              onMouseEnter={playHover}
              onClick={playClick}
              className="flex items-center space-x-3 group"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeThemeConfig.gradient} flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${activeThemeConfig.primaryGlow}`}
              >
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
                  Digital Twin <span className="text-accent font-mono-code text-xs">v2.0</span>
                </span>
                <span className="block text-[9px] uppercase font-extrabold text-gray-400 tracking-widest">
                  Virtual Campus Twin
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={playHover}
                    onClick={playClick}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-white/10 text-white border border-accent/40 shadow-md"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Theme Switcher, SFX Toggle, Search */}
            <div className="flex items-center space-x-2 sm:space-x-3">

              {/* Theme Switcher Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    playClick();
                    setIsThemeMenuOpen(!isThemeMenuOpen);
                  }}
                  onMouseEnter={playHover}
                  title="Switch Theme"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all shadow-sm"
                >
                  <Palette className="w-3.5 h-3.5 text-accent" />
                  <span className="hidden md:inline text-xs font-bold">{activeThemeConfig.name}</span>
                </button>

                {/* Theme Dropdown */}
                {isThemeMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 p-2 rounded-2xl glass-panel bg-slate-950/95 border border-white/15 shadow-2xl z-50 animate-fadeIn">
                    <p className="text-[10px] uppercase font-extrabold text-gray-400 px-3 py-1.5 tracking-wider">
                      Select UI Theme
                    </p>
                    <div className="space-y-1">
                      {(Object.keys(THEMES) as ThemeMode[]).map((modeKey) => {
                        const t = THEMES[modeKey];
                        const isSelected = theme === modeKey;
                        return (
                          <button
                            key={modeKey}
                            onClick={() => {
                              setTheme(modeKey);
                              setIsThemeMenuOpen(false);
                            }}
                            onMouseEnter={playHover}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                              isSelected
                                ? "bg-white/10 text-white font-bold border border-white/10"
                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block shadow-sm"
                                style={{ backgroundColor: t.accentHex }}
                              ></span>
                              <div>
                                <span className="block font-bold">{t.name}</span>
                                <span className="block text-[10px] text-gray-400 font-normal">
                                  {t.subtitle}
                                </span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-accent" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sound SFX Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                onMouseEnter={playHover}
                title={soundEnabled ? "Mute UI Sound SFX" : "Enable UI Sound SFX"}
                className={`p-2 rounded-xl border transition-all ${
                  soundEnabled
                    ? "bg-white/10 border-accent/40 text-accent"
                    : "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 animate-pulse" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              {/* Quick Search Button */}
              <button
                onClick={() => {
                  playClick();
                  setIsCommandOpen(true);
                }}
                onMouseEnter={playHover}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-all shadow-sm"
              >
                <Search className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline font-medium">Search...</span>
                <span className="hidden sm:flex items-center gap-0.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/10 font-mono-code text-gray-300">
                  <Command className="w-2.5 h-2.5" /> K
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-white/10 px-4 py-4 space-y-2 bg-slate-950/95">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white/10 text-white border border-accent/40"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
