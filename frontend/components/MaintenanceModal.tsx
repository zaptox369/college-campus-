"use client";

import React, { useState } from "react";
import { X, Wrench, AlertTriangle, Send } from "lucide-react";
import { api } from "@/lib/api";

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MaintenanceModal({ isOpen, onClose, onSuccess }: MaintenanceModalProps) {
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !description) return;
    setIsSubmitting(true);
    try {
      await api.createMaintenanceReport({
        user_name: userName || "Anonymous Student",
        location,
        title,
        description,
        priority
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit maintenance report", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-gray-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Report Maintenance Issue</h3>
            <p className="text-xs text-gray-400">Notify facility management of campus infrastructure issues.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Your Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe or Student ID"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Campus Location *</label>
            <input
              type="text"
              required
              placeholder="e.g. Academic Block A - Room A101"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Issue Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Projector HDMI port broken or AC not cooling"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Priority Level</label>
            <div className="grid grid-cols-3 gap-2">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    priority === p
                      ? p === "High" ? "bg-rose-500/20 text-rose-400 border-rose-500/50" :
                        p === "Medium" ? "bg-amber-500/20 text-amber-400 border-amber-500/50" :
                        "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                      : "bg-slate-900 text-gray-400 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  {p} Priority
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Issue Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Provide details to assist maintenance crew..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
