"use client";

import { format, isPast, isToday } from "date-fns";
import clsx from "clsx";
import {
  Calendar,
  Flag,
  Tag,
  Circle,
  Clock,
  CheckCircle2,
  Eye,
  AlertCircle,
} from "lucide-react";
import {
  Task,
  TaskStatus,
  TaskPriority,
  statusLabels,
  sampleProjects,
} from "@/store/taskStore";

const priorityConfig: Record<
  TaskPriority,
  { color: string; bg: string; border: string }
> = {
  urgent: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  high: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  medium: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
  },
  low: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
};

const statusConfig: Record<TaskStatus, { icon: React.ReactNode; color: string }> = {
  todo: {
    icon: <Circle className="w-3.5 h-3.5" />,
    color: "text-zinc-400",
  },
  "in-progress": {
    icon: <Clock className="w-3.5 h-3.5" />,
    color: "text-blue-400",
  },
  "in-review": {
    icon: <Eye className="w-3.5 h-3.5" />,
    color: "text-purple-400",
  },
  done: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: "text-emerald-400",
  },
};

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  compact?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  isDragging?: boolean;
}

export default function TaskCard({ task, onClick, compact, draggable, onDragStart, isDragging }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const project = sampleProjects.find((p) => p.id === task.projectId);
  const isOverdue =
    task.dueDate && isPast(new Date(task.dueDate)) && task.status !== "done";
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <button
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
      onClick={() => onClick(task)}
      className={clsx(
        "w-full text-left rounded-xl border border-white/[0.06] p-4 transition-all duration-200",
        "bg-[#1a1a2e] hover:bg-[#1f1f38] hover:border-indigo-500/30",
        "hover:shadow-lg hover:shadow-indigo-500/5",
        "group cursor-pointer",
        task.status === "done" && "opacity-60",
        isDragging && "opacity-40 scale-95 border-indigo-500/40"
      )}
    >
      <div className="flex items-start gap-3">
        <span className={clsx("mt-0.5 flex-shrink-0", status.color)}>
          {status.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={clsx(
                "text-sm font-medium text-zinc-100 truncate",
                "group-hover:text-white transition-colors",
                task.status === "done" && "line-through text-zinc-400"
              )}
            >
              {task.title}
            </h3>
          </div>

          {!compact && task.description && (
            <p className="text-xs text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="flex items-center flex-wrap gap-2">
            {/* Priority badge */}
            <span
              className={clsx(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border",
                priority.color,
                priority.bg,
                priority.border
              )}
            >
              <Flag className="w-2.5 h-2.5" />
              {task.priority}
            </span>

            {/* Status badge */}
            <span
              className={clsx(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                "bg-white/5 text-zinc-400 border border-white/[0.06]"
              )}
            >
              {statusLabels[task.status]}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span
                className={clsx(
                  "inline-flex items-center gap-1 text-[10px]",
                  isOverdue
                    ? "text-red-400"
                    : isDueToday
                    ? "text-amber-400"
                    : "text-zinc-500"
                )}
              >
                {isOverdue && <AlertCircle className="w-2.5 h-2.5" />}
                <Calendar className="w-2.5 h-2.5" />
                {format(new Date(task.dueDate), "MMM d")}
              </span>
            )}

            {/* Project */}
            {project && (
              <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </span>
            )}
          </div>

          {/* Tags */}
          {!compact && task.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <Tag className="w-2.5 h-2.5 text-zinc-600" />
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
