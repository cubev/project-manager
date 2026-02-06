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
  isToday,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { CalendarEvent } from "@/types";

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface MiniCalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
  selectedDate?: Date | null;
  onSelectDate?: (date: Date) => void;
}

export default function MiniCalendar({
  currentDate,
  onDateChange,
  events,
  selectedDate,
  onSelectDate,
}: MiniCalendarProps) {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const eventDates = useMemo(() => {
    const set = new Set<string>();
    for (const e of events) set.add(e.date);
    return set;
  }, [events]);

  return (
    <div className="bg-bg-secondary rounded-xl border border-border-secondary p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => onDateChange(subMonths(currentDate, 1))}
            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDateChange(addMonths(currentDate, 1))}
            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-text-muted py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, idx) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);
          const hasEvents = eventDates.has(dateKey);
          const selected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={idx}
              onClick={() => onSelectDate?.(day)}
              className={clsx(
                "relative flex flex-col items-center justify-center w-full aspect-square rounded-md text-xs transition-all duration-100",
                !inMonth && "opacity-25",
                today && !selected && "bg-accent-indigo text-white font-bold",
                selected && "bg-accent-indigo/20 ring-1 ring-accent-indigo text-accent-indigo-hover font-bold",
                !today && !selected && inMonth && "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              )}
            >
              {format(day, "d")}
              {/* Event dot */}
              {hasEvents && !today && !selected && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-accent-indigo" />
              )}
              {hasEvents && (today || selected) && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-white/70" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
