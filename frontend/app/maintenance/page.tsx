"use client";

import React, { useEffect, useState } from "react";
import MaintenanceModal from "@/components/MaintenanceModal";
import { api } from "@/lib/api";
import { Wrench, Plus, CheckCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react";

export default function MaintenancePage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReports = async () => {
    try {
      const data = await api.getMaintenanceReports();
      setReports(data);
    } catch (err) {
      console.error("Error loading maintenance reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatusChange = async (reportId: number, nextStatus: string) => {
    try {
      await api.updateMaintenanceStatus(reportId, nextStatus);
      loadReports();
    } catch (err) {
      console.error("Failed to update ticket status", err);
    }
  };

  const statuses = ["Reported", "Assigned", "In Progress", "Resolved"];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Wrench className="w-8 h-8 text-amber-500" />
            Campus Maintenance & Operations Board
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track infrastructure maintenance, HVAC repairs, projector fixes, and plumbing service tickets.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-bold text-xs shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Submit Maintenance Report
        </button>
      </div>

      {/* Kanban / Status Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map((status) => {
          const columnReports = reports.filter((r) => r.status === status);
          return (
            <div key={status} className="glass-panel rounded-3xl p-5 border border-gray-800 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    status === "Resolved" ? "bg-emerald-400" :
                    status === "In Progress" ? "bg-blue-400" :
                    status === "Assigned" ? "bg-amber-400" : "bg-rose-400"
                  }`}></span>
                  {status}
                </h3>
                <span className="text-xs font-bold text-gray-400 bg-gray-900 px-2.5 py-0.5 rounded-full">
                  {columnReports.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {columnReports.map((report) => (
                  <div key={report.id} className="glass-card p-4 rounded-2xl border border-gray-800 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                      <span className={`px-2 py-0.5 rounded-md ${
                        report.priority === "High" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                        report.priority === "Medium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                        "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {report.priority} Priority
                      </span>
                      <span className="text-gray-400">#{report.id}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{report.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">📍 {report.location}</p>
                      <p className="text-xs text-gray-300 mt-2 bg-slate-900/60 p-2 rounded-xl text-[11px]">
                        {report.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-gray-500">By: {report.user_name}</span>
                      {status !== "Resolved" && (
                        <button
                          onClick={() => {
                            const nextIdx = statuses.indexOf(status) + 1;
                            if (nextIdx < statuses.length) {
                              handleStatusChange(report.id, statuses[nextIdx]);
                            }
                          }}
                          className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          Advance <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {columnReports.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-8">No tickets in {status}.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadReports()}
      />
    </div>
  );
}
