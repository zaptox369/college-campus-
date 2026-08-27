"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, DoorOpen, Calendar, Wrench, Navigation, X, Sparkles, Command, Palette } from "lucide-react";
import { api } from "@/lib/api";
import { useTheme, THEMES, ThemeMode } from "./ThemeProvider";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [buildings, setBuildings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { theme, setTheme, playHover, playClick } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([api.getBuildings(), api.getRooms({}), api.getEvents()])
        .then(([b, r, e]) => {
          setBuildings(b);
          setRooms(r);
          setEvents(e);
        })
        .catch((err) => console.error("Command palette load error", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredBuildings = buildings.filter(
    (b) => b.name.toLowerCase().includes(query.toLowerCase()) || b.code.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRooms = rooms.filter(
    (r) =>
      r.room_number.toLowerCase().includes(query.toLowerCase()) ||
      (r.name && r.name.toLowerCase().includes(query.toLowerCase())) ||
      r.building_name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvents = events.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()));

  const themeCommands = (Object.keys(THEMES) as ThemeMode[]).filter((key) =>
    THEMES[key].name.toLowerCase().includes(query.toLowerCase()) || "theme".includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    playClick();
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-slate-950/90 border border-white/20 rounded-3xl shadow-2xl overflow-hidden glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-slate-950/80">
          <Search className="w-5 h-5 text-accent shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Search buildings, rooms, events, themes... (e.g. A101, Cyber, Library)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500 font-medium"
            autoFocus
          />
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 bg-white/10 px-2 py-1 rounded-lg border border-white/10 font-mono-code">
              <Command className="w-3 h-3 text-accent" /> K
            </span>
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400 font-extrabold uppercase animate-pulse">
              Scanning Virtual Twin Network...
            </div>
          ) : (
            <>
              {/* Theme Commands section */}
              {themeCommands.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-accent px-2 mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3 h-3" /> UI Theme Commands
                  </h4>
                  <div className="space-y-1">
                    {themeCommands.map((modeKey) => {
                      const t = THEMES[modeKey];
                      return (
                        <button
                          key={modeKey}
                          onMouseEnter={playHover}
                          onClick={() => {
                            setTheme(modeKey);
                            onClose();
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-left text-xs"
                        >
                          <div className="flex items-center space-x-3">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/20"
                              style={{ backgroundColor: t.accentHex }}
                            ></span>
                            <span className="font-bold text-white">Switch to {t.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono-code">{t.subtitle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Buildings Section */}
              {filteredBuildings.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-accent px-2 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" /> Campus Buildings
                  </h4>
                  <div className="space-y-1">
                    {filteredBuildings.slice(0, 4).map((b) => (
                      <button
                        key={b.id}
                        onMouseEnter={playHover}
                        onClick={() => handleSelect(`/map?building_id=${b.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-left text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <Building2 className="w-4 h-4 text-accent shrink-0" />
                          <div>
                            <span className="font-bold text-white block">{b.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono-code">{b.code} • {b.category}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-accent">Map →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms Section */}
              {filteredRooms.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-accent px-2 mb-1.5 flex items-center gap-1.5">
                    <DoorOpen className="w-3 h-3" /> Rooms & Hubs
                  </h4>
                  <div className="space-y-1">
                    {filteredRooms.slice(0, 5).map((r) => (
                      <button
                        key={r.id}
                        onMouseEnter={playHover}
                        onClick={() => handleSelect(`/rooms?room_id=${r.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-left text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <DoorOpen className="w-4 h-4 text-gray-400 shrink-0" />
                          <div>
                            <span className="font-bold text-white block">
                              Room {r.room_number} {r.name ? `(${r.name})` : ""}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono-code">
                              {r.building_name} • Cap: {r.capacity}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-gray-300">Inspect →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
