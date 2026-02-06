"use client";

import { CalendarEvent } from "@/types";
import { format, addMonths } from "date-fns";

const STORAGE_KEY = "pm-calendar-events";

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function createSeedEvents(): CalendarEvent[] {
  const now = new Date();
  const currentMonth = format(now, "yyyy-MM");
  const nextMonth = format(addMonths(now, 1), "yyyy-MM");

  return [
    {
      id: generateId(),
      title: "Sprint Planning",
      description: "Plan tasks and priorities for the upcoming sprint cycle.",
      date: `${currentMonth}-03`,
      startTime: "09:00",
      endTime: "10:30",
      color: "#6366f1",
      type: "meeting",
      projectId: "proj-1",
    },
    {
      id: generateId(),
      title: "Design Review",
      description: "Review new dashboard mockups and finalize component library.",
      date: `${currentMonth}-07`,
      startTime: "14:00",
      endTime: "15:00",
      color: "#8b5cf6",
      type: "meeting",
      projectId: "proj-1",
    },
    {
      id: generateId(),
      title: "API v2 Deadline",
      description: "Complete REST API v2 endpoints and documentation.",
      date: `${currentMonth}-12`,
      startTime: "17:00",
      endTime: "17:00",
      color: "#ef4444",
      type: "deadline",
      projectId: "proj-2",
    },
    {
      id: generateId(),
      title: "Team Standup",
      description: "Daily sync with the engineering team.",
      date: `${currentMonth}-15`,
      startTime: "09:30",
      endTime: "09:45",
      color: "#10b981",
      type: "meeting",
      projectId: "proj-1",
    },
    {
      id: generateId(),
      title: "Beta Launch",
      description: "Public beta release of the platform.",
      date: `${currentMonth}-20`,
      startTime: "10:00",
      endTime: "10:00",
      color: "#f59e0b",
      type: "milestone",
      projectId: "proj-2",
    },
    {
      id: generateId(),
      title: "Code Freeze Reminder",
      description: "No new features after this date. Bug fixes only.",
      date: `${currentMonth}-25`,
      startTime: "08:00",
      endTime: "08:00",
      color: "#ec4899",
      type: "reminder",
      projectId: "proj-1",
    },
    {
      id: generateId(),
      title: "Client Presentation",
      description: "Present Q1 progress and roadmap to stakeholders.",
      date: `${nextMonth}-05`,
      startTime: "11:00",
      endTime: "12:00",
      color: "#6366f1",
      type: "meeting",
      projectId: "proj-2",
    },
    {
      id: generateId(),
      title: "Infrastructure Migration",
      description: "Migrate production services to new cloud provider.",
      date: `${nextMonth}-10`,
      startTime: "06:00",
      endTime: "18:00",
      color: "#ef4444",
      type: "deadline",
      projectId: "proj-3",
    },
    {
      id: generateId(),
      title: "Retrospective",
      description: "Sprint retrospective and team feedback session.",
      date: `${nextMonth}-14`,
      startTime: "15:00",
      endTime: "16:00",
      color: "#10b981",
      type: "meeting",
      projectId: "proj-1",
    },
    {
      id: generateId(),
      title: "Performance Review Prep",
      description: "Prepare self-assessment documents for quarterly reviews.",
      date: `${nextMonth}-18`,
      startTime: "09:00",
      endTime: "09:00",
      color: "#f59e0b",
      type: "reminder",
      projectId: "proj-3",
    },
  ];
}

function loadEvents(): CalendarEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  const seed = createSeedEvents();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function saveEvents(events: CalendarEvent[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function getEvents(): CalendarEvent[] {
  return loadEvents();
}

export function addEvent(event: Omit<CalendarEvent, "id">): CalendarEvent {
  const events = loadEvents();
  const newEvent: CalendarEvent = { ...event, id: generateId() };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
}

export function updateEvent(
  id: string,
  updates: Partial<Omit<CalendarEvent, "id">>
): CalendarEvent | null {
  const events = loadEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return null;
  events[index] = { ...events[index], ...updates };
  saveEvents(events);
  return events[index];
}

export function deleteEvent(id: string): boolean {
  const events = loadEvents();
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return false;
  saveEvents(filtered);
  return true;
}

export function getEventsForDate(date: string): CalendarEvent[] {
  return loadEvents().filter((e) => e.date === date);
}

export const EVENT_COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Rose", value: "#ec4899" },
  { name: "Red", value: "#ef4444" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Slate", value: "#64748b" },
];

export const SAMPLE_PROJECTS = [
  { id: "proj-1", name: "Frontend Redesign" },
  { id: "proj-2", name: "API Platform" },
  { id: "proj-3", name: "Infrastructure" },
];
