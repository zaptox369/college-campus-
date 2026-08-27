"use client";

import React, { useEffect, useState } from "react";
import { connectWebSocket } from "@/lib/websocket";
import { Activity, ChevronDown, ChevronUp, Zap, Radio, Bell } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ActivityLog {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  badgeColor: string;
}

export default function IoTActivityDrawer() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(false);

  const { playHover, playClick, playPulse } = useTheme();

  useEffect(() => {
    // Initial sample system events
    setLogs([
      {
        id: "1",
        type: "SYSTEM_INIT",
        message: "IoT Sensor Gateway initialized across 7 building blocks",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        badgeColor: "bg-white/10 text-white border-white/20",
      },
    ]);

    const cleanupWS = connectWebSocket((msg) => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      let newLog: ActivityLog | null = null;

      if (msg.type === "ROOM_UPDATE") {
        newLog = {
          id: Math.random().toString(),
          type: "ROOM_UPDATE",
          message: `Room ${msg.room_number || msg.room_id}: occupancy updated to ${msg.current_occupancy}/${msg.capacity} (${msg.occupancy_pct}%)`,
          timestamp: nowStr,
          badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        };
      } else if (msg.type === "MAINTENANCE_UPDATE") {
        newLog = {
          id: Math.random().toString(),
          type: "MAINTENANCE",
          message: `Maintenance Ticket #${msg.id || ""}: ${msg.title || "Status updated"}`,
          timestamp: nowStr,
          badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        };
      }

      if (newLog) {
        setLogs((prev) => [newLog!, ...prev.slice(0, 15)]);
        setHasNewAlert(true);
        playPulse();
      }
    });

    return () => cleanupWS();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm sm:max-w-md w-full animate-fadeIn">
      <div className="glass-panel rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-slate-950/90">
        {/* Drawer Header Toggle */}
        <button
          onClick={() => {
            playClick();
            setIsExpanded(!isExpanded);
            setHasNewAlert(false);
          }}
          onMouseEnter={playHover}
          className="w-full flex items-center justify-between p-3.5 px-4 bg-slate-950/80 border-b border-white/10 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-accent animate-pulse" /> IoT Telemetry Stream
            </span>
            {hasNewAlert && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-black text-slate-950 animate-bounce">
                NEW
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-gray-400">
            <span className="text-[10px] font-mono-code font-bold text-accent">
              {logs.length} events
            </span>
            {isExpanded ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronUp className="w-4 h-4 text-white" />}
          </div>
        </button>

        {/* Expanded Feed Content */}
        {isExpanded && (
          <div className="max-h-72 overflow-y-auto p-3 space-y-2 bg-slate-950/60">
            {logs.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Listening for live IoT updates...</p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between text-xs animate-fadeIn"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${log.badgeColor}`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-gray-200 font-medium text-xs mt-1">{log.message}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono-code shrink-0 ml-2">
                    {log.timestamp}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
