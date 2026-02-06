"use client";

import { useEffect } from "react";
import { format, isPast, isToday } from "date-fns";
import clsx from "clsx";
import {
  X,
  Calendar,
  Flag,
  Tag,
  FolderOpen,
  Clock,
  CheckCircle2,
  Circle,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  Task,
  TaskStatus,
  TaskPriority,
  statusLabels,
  priorityLabels,
  sampleProjects,
} from "@/store/taskStore";

const priorityColors: Record<TaskPriority, string> = {
  urgent: "text-red-400 bg-red-500/10 border-red-500/30",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  todo: <Circle className="w-4 h-4" />,
  "in-progress": <Clock className="w-4 h-4" />,
  "in-review": <Eye className="w-4 h-4" />,
  done: <CheckCircle2 className="w-4 h-4" />,
};

const statusColors: Record<TaskStatus, string> = {
  todo: "text-zinc-400",
  "in-progress": "text-blue-400",
  "in-review": "text-purple-400",
  done: "text-emerald-400",
};

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export default function TaskDetailPanel({
  task,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskDetailPanelProps) {
  const project = sampleProjects.find((p) => p.id === task.projectId);
  const isOverdue =
    task.dueDate && isPast(new Date(task.dueDate)) && task.status !== "done";
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const allStatuses: TaskStatus[] = [
    "todo",
    "in-progress",
    "in-review",
    "done",
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[#12121a] border-l border-white/[0.06] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-[#12121a]/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-sm font-medium text-zinc-400">Task Details</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
              title="Edit task"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Title */}
          <div>
            <h1
              className={clsx(
                "text-xl font-semibold text-zinc-100 leading-tight",
                task.status === "done" && "line-through text-zinc-400"
              )}
            >
              {task.title}
            </h1>
          </div>

          {/* Status selector */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {allStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(task.id, s)}
                  className={clsx(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    task.status === s
                      ? clsx(
                          "border",
                          s === "todo" &&
                            "bg-zinc-500/10 border-zinc-500/30 text-zinc-300",
                          s === "in-progress" &&
                            "bg-blue-500/10 border-blue-500/30 text-blue-300",
                          s === "in-review" &&
                            "bg-purple-500/10 border-purple-500/30 text-purple-300",
                          s === "done" &&
                            "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        )
                      : "bg-white/[0.03] border border-white/[0.06] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12]"
                  )}
                >
                  <span className={statusColors[s]}>{statusIcons[s]}</span>
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Priority
            </label>
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border",
                priorityColors[task.priority]
              )}
            >
              <Flag className="w-3.5 h-3.5" />
              {priorityLabels[task.priority]}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Description
              </label>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Due Date
              </label>
              <span
                className={clsx(
                  "inline-flex items-center gap-2 text-sm",
                  isOverdue
                    ? "text-red-400"
                    : isDueToday
                    ? "text-amber-400"
                    : "text-zinc-300"
                )}
              >
                {isOverdue && <AlertCircle className="w-4 h-4" />}
                <Calendar className="w-4 h-4" />
                {format(new Date(task.dueDate), "EEEE, MMMM d, yyyy")}
                {isOverdue && (
                  <span className="text-xs text-red-400 ml-1">(Overdue)</span>
                )}
                {isDueToday && (
                  <span className="text-xs text-amber-400 ml-1">(Today)</span>
                )}
              </span>
            </div>
          )}

          {/* Project */}
          {project && (
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Project
              </label>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-300">
                <FolderOpen className="w-4 h-4 text-zinc-400" />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </span>
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="space-y-2 text-xs text-zinc-500">
              <div className="flex justify-between">
                <span>Created</span>
                <span>
                  {format(new Date(task.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last updated</span>
                <span>
                  {format(new Date(task.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ID</span>
                <span className="font-mono">{task.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
