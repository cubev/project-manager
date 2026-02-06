"use client";

import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import clsx from "clsx";
import { CalendarEvent } from "@/types";
import { EVENT_COLORS, SAMPLE_PROJECTS } from "@/store/calendarStore";

type EventType = CalendarEvent["type"];

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "meeting", label: "Meeting" },
  { value: "deadline", label: "Deadline" },
  { value: "milestone", label: "Milestone" },
  { value: "reminder", label: "Reminder" },
];

interface EventFormProps {
  event?: CalendarEvent | null;
  defaultDate?: string;
  onSave: (data: Omit<CalendarEvent, "id">) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export default function EventForm({
  event,
  defaultDate,
  onSave,
  onDelete,
  onClose,
}: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [color, setColor] = useState(EVENT_COLORS[0].value);
  const [eventType, setEventType] = useState<EventType>("meeting");
  const [projectId, setProjectId] = useState(SAMPLE_PROJECTS[0].id);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDate(event.date);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setColor(event.color);
      setEventType(event.type);
      setProjectId(event.projectId);
    } else if (defaultDate) {
      setDate(defaultDate);
    }
  }, [event, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      date,
      startTime,
      endTime,
      color,
      type: eventType,
      projectId,
    });
  };

  const isEditing = !!event;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-bg-secondary border border-border-secondary rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-secondary">
          <h2 className="text-lg font-semibold text-text-primary">
            {isEditing ? "Edit Event" : "New Event"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title..."
              className="w-full px-3 py-2.5 bg-bg-primary border border-border-primary rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 focus:border-accent-indigo transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full px-3 py-2.5 bg-bg-primary border border-border-primary rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 focus:border-accent-indigo transition-colors resize-none"
            />
          </div>

          {/* Date + Times */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-bg-primary border border-border-primary rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 focus:border-accent-indigo transition-colors [color-scheme:dark]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Start
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-bg-primary border border-border-primary rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 focus:border-accent-indigo transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                End
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-bg-primary border border-border-primary rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 focus:border-accent-indigo transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Event Type + Project */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full px-3 py-2.5 bg-bg-primary border border-border-primary rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 focus:border-accent-indigo transition-colors [color-scheme:dark]"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2.5 bg-bg-primary border border-border-primary rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 focus:border-accent-indigo transition-colors [color-scheme:dark]"
              >
                {SAMPLE_PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {EVENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={clsx(
                    "w-8 h-8 rounded-full transition-all duration-150",
                    color === c.value
                      ? "ring-2 ring-offset-2 ring-offset-bg-secondary scale-110"
                      : "hover:scale-110"
                  )}
                  style={
                    {
                      backgroundColor: c.value,
                      "--tw-ring-color": color === c.value ? c.value : undefined,
                    } as React.CSSProperties
                  }
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {isEditing && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(event!.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-accent-indigo hover:bg-accent-indigo-hover rounded-lg transition-colors shadow-lg shadow-accent-indigo/20"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
