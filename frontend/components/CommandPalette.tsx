"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, DoorOpen, Calendar, Wrench, Navigation, X, Sparkles, Command } from "lucide-react";
import { api } from "@/lib/api";

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

  const handleSelect = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-slate-900/90 border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-blue-400 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Search buildings, rooms, events, or navigation... (e.g. A101, Library)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500 font-medium"
            autoFocus
          />
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 bg-gray-800/80 px-2 py-1 rounded-lg border border-gray-700 font-mono-code">
              <Command className="w-3 h-3" /> K
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading ? (
            <p className="text-xs text-gray-400 text-center py-8">Loading campus index...</p>
          ) : (
            <>
              {/* Quick Navigation Section */}
              {!query && (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Quick Navigation Shortcuts
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSelect("/map")}
                      className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/50 text-left flex items-center gap-3 transition-all"
                    >
                      <Building2 className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Campus Map</p>
                        <p className="text-[10px] text-gray-400">Interactive Blueprint</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelect("/rooms")}
                      className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 text-left flex items-center gap-3 transition-all"
                    >
                      <DoorOpen className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Find Room</p>
                        <p className="text-[10px] text-gray-400">Real-time Availability</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelect("/navigation")}
                      className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/50 text-left flex items-center gap-3 transition-all"
                    >
                      <Navigation className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Route Engine</p>
                        <p className="text-[10px] text-gray-400">Step-by-step guidance</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelect("/predictions")}
                      className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/50 text-left flex items-center gap-3 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs font-bold text-white">AI Crowd Forecast</p>
                        <p className="text-[10px] text-gray-400">Predict room demand</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Buildings Section */}
              {filteredBuildings.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Buildings ({filteredBuildings.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredBuildings.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleSelect(`/rooms?building_id=${b.id}`)}
                        className="w-full p-2.5 rounded-xl hover:bg-blue-600/20 border border-transparent hover:border-blue-500/30 flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="w-4 h-4 text-blue-400" />
                          <div>
                            <span className="text-xs font-bold text-white group-hover:text-blue-300">{b.name}</span>
                            <span className="text-[11px] text-gray-400 ml-2">({b.code})</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-blue-400 font-semibold uppercase">
                          {b.occupancy_pct}% Occupied
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms Section */}
              {filteredRooms.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Rooms ({filteredRooms.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredRooms.slice(0, 8).map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleSelect(`/rooms?building_id=${r.building_id}`)}
                        className="w-full p-2.5 rounded-xl hover:bg-indigo-600/20 border border-transparent hover:border-indigo-500/30 flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <DoorOpen className="w-4 h-4 text-indigo-400" />
                          <div>
                            <span className="text-xs font-bold text-white group-hover:text-indigo-300">
                              Room {r.room_number} {r.name ? `(${r.name})` : ""}
                            </span>
                            <span className="text-[11px] text-gray-400 block">{r.building_name} • Floor {r.floor}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          r.status === "available" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {r.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Events Section */}
              {filteredEvents.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Campus Events ({filteredEvents.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleSelect("/events")}
                        className="w-full p-2.5 rounded-xl hover:bg-purple-600/20 border border-transparent hover:border-purple-500/30 flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <div>
                            <span className="text-xs font-bold text-white group-hover:text-purple-300">{e.title}</span>
                            <span className="text-[11px] text-gray-400 block">📍 {e.location_name}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-purple-400 font-semibold">{e.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredBuildings.length === 0 && filteredRooms.length === 0 && filteredEvents.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No matching nodes found for &quot;{query}&quot;
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
