"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import clsx from "clsx";
import {
  Plus,
  Search,
  List,
  LayoutGrid,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  ChevronDown,
  ListTodo,
  AlertTriangle,
} from "lucide-react";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import TaskDetailPanel from "@/components/TaskDetailPanel";
import {
  Task,
  TaskStatus,
  TaskPriority,
  loadTasks,
  createTask,
  updateTask,
  deleteTask,
  statusLabels,
  sampleProjects,
} from "@/store/taskStore";
import { isPast } from "date-fns";

type ViewMode = "list" | "kanban";
type FilterTab = "all" | "active" | "completed" | "overdue";
type SortKey = "dueDate" | "priority" | "createdAt" | "title";

const priorityWeight: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const kanbanColumns: TaskStatus[] = ["todo", "in-progress", "in-review", "done"];

const kanbanColumnConfig: Record<
  TaskStatus,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  todo: {
    icon: <Circle className="w-4 h-4" />,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
  },
  "in-progress": {
    icon: <Clock className="w-4 h-4" />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  "in-review": {
    icon: <Eye className="w-4 h-4" />,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  done: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortAsc, setSortAsc] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterProject, setFilterProject] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  useEffect(() => {
    setTasks(loadTasks());
    setMounted(true);
  }, []);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Filter by tab
    switch (filterTab) {
      case "active":
        result = result.filter((t) => t.status !== "done");
        break;
      case "completed":
        result = result.filter((t) => t.status === "done");
        break;
      case "overdue":
        result = result.filter(
          (t) =>
            t.dueDate &&
            isPast(new Date(t.dueDate)) &&
            t.status !== "done"
        );
        break;
    }

    // Filter by project
    if (filterProject) {
      result = result.filter((t) => t.projectId === filterProject);
    }

    // Filter by priority
    if (filterPriority) {
      result = result.filter((t) => t.priority === filterPriority);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "dueDate":
          cmp = (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
          break;
        case "priority":
          cmp = priorityWeight[b.priority] - priorityWeight[a.priority];
          break;
        case "createdAt":
          cmp = b.createdAt.localeCompare(a.createdAt);
          break;
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [tasks, searchQuery, filterTab, filterProject, filterPriority, sortKey, sortAsc]);

  const handleCreateTask = useCallback(
    (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      setTasks((prev) => createTask(prev, data));
      setShowForm(false);
    },
    []
  );

  const handleUpdateTask = useCallback(
    (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      if (!editingTask) return;
      setTasks((prev) => updateTask(prev, editingTask.id, data));
      setEditingTask(null);
      setSelectedTask(null);
    },
    [editingTask]
  );

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => deleteTask(prev, id));
  }, []);

  const handleStatusChange = useCallback(
    (id: string, status: TaskStatus) => {
      setTasks((prev) => updateTask(prev, id, { status }));
      if (selectedTask?.id === id) {
        setSelectedTask((prev) => (prev ? { ...prev, status } : null));
      }
    },
    [selectedTask]
  );

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setSelectedTask(null);
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggingTaskId(task.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      handleStatusChange(taskId, targetStatus);
    }
    setDraggingTaskId(null);
    setDragOverColumn(null);
  }, [handleStatusChange]);

  const handleDragEnd = useCallback(() => {
    setDraggingTaskId(null);
    setDragOverColumn(null);
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const overdue = tasks.filter(
      (t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "done"
    ).length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    return { total, done, overdue, inProgress };
  }, [tasks]);

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All Tasks", count: tasks.length },
    {
      key: "active",
      label: "Active",
      count: tasks.filter((t) => t.status !== "done").length,
    },
    {
      key: "completed",
      label: "Completed",
      count: tasks.filter((t) => t.status === "done").length,
    },
    {
      key: "overdue",
      label: "Overdue",
      count: tasks.filter(
        (t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "done"
      ).length,
    },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0f0f10] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f10] text-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <ListTodo className="w-7 h-7 text-indigo-400" />
              Tasks
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {stats.total} tasks total &middot; {stats.done} completed &middot;{" "}
              {stats.inProgress} in progress
              {stats.overdue > 0 && (
                <span className="text-red-400">
                  {" "}
                  &middot; {stats.overdue} overdue
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
                  filterTab === tab.key
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {tab.key === "overdue" && tab.count > 0 && (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                )}
                {tab.label}
                <span
                  className={clsx(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    filterTab === tab.key
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "bg-white/5 text-zinc-500"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search + View toggle + Sort */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
              />
            </div>

            {/* Filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors",
                showFilters || filterProject || filterPriority
                  ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-300"
                  : "bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.16]"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(filterProject || filterPriority) && (
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="appearance-none pl-9 pr-8 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="dueDate" className="bg-[#12121a]">
                  Due Date
                </option>
                <option value="priority" className="bg-[#12121a]">
                  Priority
                </option>
                <option value="createdAt" className="bg-[#12121a]">
                  Created
                </option>
                <option value="title" className="bg-[#12121a]">
                  Title
                </option>
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            </div>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-zinc-400 hover:text-zinc-200 hover:border-white/[0.16] transition-colors"
              title={sortAsc ? "Ascending" : "Descending"}
            >
              <ArrowUpDown
                className={clsx(
                  "w-4 h-4 transition-transform",
                  !sortAsc && "rotate-180"
                )}
              />
            </button>

            {/* View toggle */}
            <div className="flex items-center border border-white/[0.08] rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={clsx(
                  "p-2.5 transition-colors",
                  viewMode === "list"
                    ? "bg-indigo-600/20 text-indigo-300"
                    : "text-zinc-500 hover:text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08]"
                )}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={clsx(
                  "p-2.5 transition-colors",
                  viewMode === "kanban"
                    ? "bg-indigo-600/20 text-indigo-300"
                    : "text-zinc-500 hover:text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08]"
                )}
                title="Kanban view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Additional filters row */}
          {showFilters && (
            <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <Filter className="w-4 h-4 text-zinc-500" />
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#12121a]">
                  All Projects
                </option>
                {sampleProjects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#12121a]">
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#12121a]">
                  All Priorities
                </option>
                <option value="urgent" className="bg-[#12121a]">
                  Urgent
                </option>
                <option value="high" className="bg-[#12121a]">
                  High
                </option>
                <option value="medium" className="bg-[#12121a]">
                  Medium
                </option>
                <option value="low" className="bg-[#12121a]">
                  Low
                </option>
              </select>
              {(filterProject || filterPriority) && (
                <button
                  onClick={() => {
                    setFilterProject("");
                    setFilterPriority("");
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-20">
                <ListTodo className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">No tasks found</p>
                <p className="text-zinc-600 text-xs mt-1">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Create a new task to get started"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={handleTaskClick}
                />
              ))
            )}
          </div>
        ) : (
          /* Kanban Board */
          <div className="grid grid-cols-4 gap-4 min-h-[60vh]">
            {kanbanColumns.map((status) => {
              const config = kanbanColumnConfig[status];
              const columnTasks = filteredTasks.filter(
                (t) => t.status === status
              );
              const isOver = dragOverColumn === status;
              return (
                <div
                  key={status}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, status)}
                  className={clsx(
                    "flex flex-col rounded-xl overflow-hidden transition-all duration-200",
                    isOver
                      ? "bg-indigo-500/[0.08] border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/10"
                      : "bg-white/[0.02] border border-white/[0.06]"
                  )}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className={config.color}>{config.icon}</span>
                      <span className="text-sm font-medium text-zinc-200">
                        {statusLabels[status]}
                      </span>
                      <span
                        className={clsx(
                          "text-xs px-1.5 py-0.5 rounded-full",
                          config.bg,
                          config.color
                        )}
                      >
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Column body */}
                  <div className={clsx(
                    "flex-1 p-2 space-y-2 overflow-y-auto transition-colors duration-200",
                    isOver && "bg-indigo-500/[0.03]"
                  )}>
                    {columnTasks.length === 0 ? (
                      <div className={clsx(
                        "flex items-center justify-center h-24 text-xs rounded-lg border-2 border-dashed transition-colors duration-200",
                        isOver
                          ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/5"
                          : "text-zinc-600 border-transparent"
                      )}>
                        {isOver ? "Drop here" : "No tasks"}
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <div key={task.id} onDragEnd={handleDragEnd}>
                          <TaskCard
                            task={task}
                            onClick={handleTaskClick}
                            compact
                            draggable
                            onDragStart={handleDragStart}
                            isDragging={draggingTaskId === task.id}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <TaskForm onSubmit={handleCreateTask} onClose={() => setShowForm(false)} />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdateTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={handleEdit}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
