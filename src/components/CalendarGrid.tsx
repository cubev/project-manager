"use client";

import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import clsx from "clsx";
import { CalendarEvent } from "@/types";

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  selectedDate: Date | null;
}

export default function CalendarGrid({
  currentDate,
  events,
  onDayClick,
  onEventClick,
  selectedDate,
}: CalendarGridProps) {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const event of events) {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    }
    return map;
  }, [events]);

  return (
    <div className="bg-bg-secondary rounded-xl border border-border-secondary overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border-secondary">
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="px-3 py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDate[dateKey] || [];
          const inCurrentMonth = isSameMonth(day, currentDate);
          const today = isToday(day);
          const selected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={idx}
              onClick={() => onDayClick(day)}
              className={clsx(
                "relative flex flex-col items-start p-2 min-h-[100px] border-b border-r border-border-secondary/50 text-left transition-colors duration-150",
                "hover:bg-bg-hover/60 focus:outline-none focus:ring-1 focus:ring-accent-indigo/40 focus:ring-inset",
                !inCurrentMonth && "opacity-30",
                selected && "bg-accent-indigo/10 ring-1 ring-accent-indigo/30 ring-inset"
              )}
            >
              {/* Day number */}
              <span
                className={clsx(
                  "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mb-1",
                  today
                    ? "bg-accent-indigo text-white font-bold"
                    : inCurrentMonth
                    ? "text-text-primary"
                    : "text-text-muted"
                )}
              >
                {format(day, "d")}
              </span>

              {/* Event pills */}
              <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="group flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium truncate cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
                    style={{
                      backgroundColor: event.color + "20",
                      color: event.color,
                      borderLeft: `2px solid ${event.color}`,
                    }}
                    title={`${event.title} (${event.startTime}–${event.endTime})`}
                  >
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-text-muted px-1.5">
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
