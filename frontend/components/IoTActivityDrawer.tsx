"use client";

import React, { useEffect, useState } from "react";
import { connectWebSocket } from "@/lib/websocket";
import { Activity, ChevronDown, ChevronUp, Zap, Radio, Bell } from "lucide-react";

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

  useEffect(() => {
    // Initial sample system events
    setLogs([
      {
        id: "1",
        type: "SYSTEM_INIT",
        message: "IoT Sensor Gateway initialized across 7 building blocks",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
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
      }
    });

    return () => cleanupWS();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full sm:w-80">
      <div className="glass-panel rounded-2xl border border-blue-500/30 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Header Bar */}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            setHasNewAlert(false);
          }}
          className="w-full px-4 py-3 bg-slate-950/80 hover:bg-slate-900 flex items-center justify-between transition-colors border-b border-gray-800"
        >
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-tight">IoT Live Stream Feed</span>
            {logs.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                {logs.length}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {hasNewAlert && !isExpanded && (
              <span className="text-[10px] font-bold text-emerald-400 animate-pulse bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                New Telemetry
              </span>
            )}
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-3 max-h-64 overflow-y-auto space-y-2 bg-slate-900/60 text-xs">
            {logs.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center py-4">Listening for live IoT updates...</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-gray-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${log.badgeColor}`}>
                      {log.type}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono-code">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-gray-200 leading-tight">{log.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
