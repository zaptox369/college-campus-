"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { soundFx } from "@/lib/soundFx";

export type ThemeMode = "cyber" | "emerald" | "aurora" | "solar" | "oled";

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  subtitle: string;
  badgeColor: string;
  primaryGlow: string;
  gradient: string;
  accentHex: string;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  cyber: {
    id: "cyber",
    name: "Cyber Hologram",
    subtitle: "Deep Cyan & Electric Blue",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    primaryGlow: "shadow-[0_0_25px_rgba(6,182,212,0.3)]",
    gradient: "from-cyan-500 via-blue-600 to-indigo-600",
    accentHex: "#06b6d4",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Matrix",
    subtitle: "Vivid Emerald & Cyber Mint",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    primaryGlow: "shadow-[0_0_25px_rgba(16,185,129,0.3)]",
    gradient: "from-emerald-500 via-teal-600 to-green-600",
    accentHex: "#10b981",
  },
  aurora: {
    id: "aurora",
    name: "Hyper Aurora",
    subtitle: "Electric Violet & Neon Magenta",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    primaryGlow: "shadow-[0_0_25px_rgba(168,85,247,0.3)]",
    gradient: "from-purple-500 via-fuchsia-600 to-pink-600",
    accentHex: "#a855f7",
  },
  solar: {
    id: "solar",
    name: "Solar Gold",
    subtitle: "Radiant Amber & Radiant Flame",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    primaryGlow: "shadow-[0_0_25px_rgba(245,158,11,0.3)]",
    gradient: "from-amber-500 via-orange-600 to-yellow-500",
    accentHex: "#f59e0b",
  },
  oled: {
    id: "oled",
    name: "Midnight OLED",
    subtitle: "High-Contrast Pure Obsidian",
    badgeColor: "bg-slate-800 text-white border-slate-600",
    primaryGlow: "shadow-[0_0_25px_rgba(59,130,246,0.25)]",
    gradient: "from-blue-500 via-sky-400 to-white",
    accentHex: "#3b82f6",
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playHover: () => void;
  playClick: () => void;
  playPulse: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("cyber");
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("dt_campus_theme") as ThemeMode;
    if (savedTheme && THEMES[savedTheme]) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "cyber");
    }

    const savedSound = localStorage.getItem("dt_campus_sound");
    if (savedSound !== null) {
      const enabled = savedSound === "true";
      setSoundEnabledState(enabled);
      soundFx.setEnabled(enabled);
    }
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem("dt_campus_theme", mode);
    document.documentElement.setAttribute("data-theme", mode);
    soundFx.playThemeSwitch();
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem("dt_campus_sound", String(enabled));
    soundFx.setEnabled(enabled);
    if (enabled) {
      soundFx.playClick();
    }
  };

  const playHover = () => soundFx.playHover();
  const playClick = () => soundFx.playClick();
  const playPulse = () => soundFx.playPulse();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        soundEnabled,
        setSoundEnabled,
        playHover,
        playClick,
        playPulse,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
