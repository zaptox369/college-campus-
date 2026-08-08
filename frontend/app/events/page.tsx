"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Calendar, MapPin, Plus, Clock, Tag, Sparkles } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [locationName, setLocationName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [category, setCategory] = useState("Academic");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const loadEvents = async () => {
    try {
      const [eData, bData] = await Promise.all([api.getEvents(), api.getBuildings()]);
      setEvents(eData);
      setBuildings(bData);
    } catch (err) {
      console.error("Error loading events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName || !organizer) return;
    try {
      await api.createEvent({
        title,
        description,
        building_id: buildingId ? parseInt(buildingId) : null,
        location_name: locationName,
        organizer,
        category,
        start_time: startTime || new Date().toISOString(),
        end_time: endTime || new Date(Date.now() + 3600000 * 2).toISOString(),
      });
      setIsModalOpen(false);
      loadEvents();
    } catch (err) {
      console.error("Error creating event", err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-indigo-500" />
            Campus Events & Activities Hub
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time schedule of workshops, tech summits, cultural fests, and athletic matches across campus venues.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Campus Event
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <p className="text-xs text-gray-400 text-center py-12">Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4 hover:border-indigo-500/40">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {event.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  {new Date(event.start_time).toLocaleDateString([], { month: "short", day: "numeric" })}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{event.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{event.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-800 space-y-1.5 text-xs">
                <div className="flex items-center text-gray-300 gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-blue-400" /> {event.location_name}
                </div>
                <div className="flex items-center text-gray-400 gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Organized by: <span className="text-white font-semibold">{event.organizer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-gray-800 text-center text-gray-400">
          No campus events scheduled at this moment.
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-gray-800 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-4">Create New Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Hackathon 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Venue / Room Name *</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Grand Auditorium or Room A101"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Organizer *</label>
                <input
                  type="text"
                  required
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g. Computer Science Club"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-white text-xs focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
