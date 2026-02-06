"use client";

import { useState, useEffect, useCallback } from "react";
import {
  addMonths,
  subMonths,
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  LayoutGrid,
  Rows3,
  Clock,
  MapPin,
} from "lucide-react";
import clsx from "clsx";

import { CalendarEvent } from "@/types";
import CalendarGrid from "@/components/CalendarGrid";
import EventForm from "@/components/EventForm";
import MiniCalendar from "@/components/MiniCalendar";
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  SAMPLE_PROJECTS,
} from "@/store/calendarStore";

type ViewMode = "month" | "week";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formDefaultDate, setFormDefaultDate] = useState<string>("");

  const refreshEvents = useCallback(() => {
    setEvents(getEvents());
  }, []);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  // Navigation
  const goToPrev = () => setCurrentDate((d) => subMonths(d, 1));
  const goToNext = () => setCurrentDate((d) => addMonths(d, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Event handlers
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setFormDefaultDate(format(date, "yyyy-MM-dd"));
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormDefaultDate("");
    setShowForm(true);
  };

  const handleSave = (data: Omit<CalendarEvent, "id">) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, data);
    } else {
      addEvent(data);
    }
    refreshEvents();
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    refreshEvents();
    setShowForm(false);
    setEditingEvent(null);
  };

  // Selected day events for sidebar
  const selectedDayEvents = selectedDate
    ? events.filter((e) => e.date === format(selectedDate, "yyyy-MM-dd"))
    : [];

  // Week view days
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate || currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate || currentDate, { weekStartsOn: 1 }),
  });

  const getProjectName = (projectId: string) => {
    return SAMPLE_PROJECTS.find((p) => p.id === projectId)?.name || projectId;
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border-secondary shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-accent-indigo" />
            <h1 className="text-xl font-bold text-text-primary">Calendar</h1>
          </div>

          {/* Month navigation */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={goToPrev}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-text-primary min-w-[140px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <button
              onClick={goToNext}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border-primary rounded-lg hover:bg-bg-hover hover:text-text-primary transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-bg-primary rounded-lg border border-border-secondary p-0.5">
            <button
              onClick={() => setViewMode("month")}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                viewMode === "month"
                  ? "bg-accent-indigo text-white"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                viewMode === "week"
                  ? "bg-accent-indigo text-white"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <Rows3 className="w-3.5 h-3.5" />
              Week
            </button>
          </div>

          <button
            onClick={() => {
              setEditingEvent(null);
              setFormDefaultDate(format(selectedDate || new Date(), "yyyy-MM-dd"));
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-accent-indigo hover:bg-accent-indigo-hover rounded-lg transition-colors shadow-lg shadow-accent-indigo/20"
          >
            <Plus className="w-4 h-4" />
            New Event
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar grid area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {viewMode === "month" ? (
            <CalendarGrid
              currentDate={currentDate}
              events={events}
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
              selectedDate={selectedDate}
            />
          ) : (
            /* Week view */
            <div className="bg-bg-secondary rounded-xl border border-border-secondary overflow-hidden">
              {/* Week header */}
              <div className="grid grid-cols-7 border-b border-border-secondary">
                {weekDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={clsx(
                      "flex flex-col items-center py-3 border-r border-border-secondary/50 last:border-r-0",
                      isToday(day) && "bg-accent-indigo/5"
                    )}
                  >
                    <span className="text-[10px] font-medium text-text-muted uppercase">
                      {format(day, "EEE")}
                    </span>
                    <span
                      className={clsx(
                        "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mt-1",
                        isToday(day)
                          ? "bg-accent-indigo text-white"
                          : "text-text-primary"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Week body */}
              <div className="grid grid-cols-7 min-h-[400px]">
                {weekDays.map((day, idx) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const dayEvents = events.filter((e) => e.date === dateKey);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDayClick(day)}
                      className={clsx(
                        "flex flex-col gap-1.5 p-2 border-r border-border-secondary/50 last:border-r-0 text-left",
                        "hover:bg-bg-hover/40 transition-colors",
                        isToday(day) && "bg-accent-indigo/5"
                      )}
                    >
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          className="flex flex-col gap-0.5 p-2 rounded-lg cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md"
                          style={{
                            backgroundColor: event.color + "15",
                            borderLeft: `3px solid ${event.color}`,
                          }}
                        >
                          <span
                            className="text-xs font-semibold truncate"
                            style={{ color: event.color }}
                          >
                            {event.title}
                          </span>
                          <span className="text-[10px] text-text-muted">
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                      ))}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="w-[300px] border-l border-border-secondary p-4 overflow-y-auto hidden lg:flex flex-col gap-4 shrink-0">
          {/* Mini calendar */}
          <MiniCalendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            events={events}
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setCurrentDate(d);
            }}
          />

          {/* Selected day events */}
          <div className="bg-bg-secondary rounded-xl border border-border-secondary p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              {selectedDate
                ? format(selectedDate, "EEEE, MMM d")
                : "Select a day"}
            </h3>
            {selectedDate && selectedDayEvents.length === 0 && (
              <p className="text-xs text-text-muted py-2">
                No events scheduled.
              </p>
            )}
            <div className="flex flex-col gap-2">
              {selectedDayEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="flex flex-col gap-1.5 p-3 rounded-lg text-left transition-all hover:bg-bg-hover"
                  style={{
                    borderLeft: `3px solid ${event.color}`,
                    backgroundColor: event.color + "08",
                  }}
                >
                  <span className="text-sm font-medium text-text-primary">
                    {event.title}
                  </span>
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px]">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[11px]">
                      {getProjectName(event.projectId)}
                    </span>
                  </div>
                  <span
                    className="inline-flex self-start px-1.5 py-0.5 text-[10px] font-medium rounded-full capitalize"
                    style={{
                      backgroundColor: event.color + "20",
                      color: event.color,
                    }}
                  >
                    {event.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming events */}
          <div className="bg-bg-secondary rounded-xl border border-border-secondary p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Upcoming
            </h3>
            <div className="flex flex-col gap-2">
              {events
                .filter((e) => e.date >= format(new Date(), "yyyy-MM-dd"))
                .sort(
                  (a, b) =>
                    a.date.localeCompare(b.date) ||
                    a.startTime.localeCompare(b.startTime)
                )
                .slice(0, 5)
                .map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="flex items-start gap-3 p-2 rounded-lg text-left hover:bg-bg-hover transition-colors"
                  >
                    <div
                      className="w-1 h-full min-h-[32px] rounded-full shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-medium text-text-primary truncate">
                        {event.title}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {format(new Date(event.date + "T00:00:00"), "MMM d")} at{" "}
                        {event.startTime}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Event form modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          defaultDate={formDefaultDate}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}
