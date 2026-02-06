"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  PauseCircle,
} from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";
import { Project } from "@/types";
import { getProjects, createProject } from "@/store/projectStore";
import ProjectForm from "@/components/ProjectForm";

const statusConfig: Record<
  Project["status"],
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  active: {
    label: "Active",
    icon: Clock,
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  "on-hold": {
    label: "On Hold",
    icon: PauseCircle,
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  },
};

const MEMBER_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
];

function getMemberColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return MEMBER_COLORS[Math.abs(hash) % MEMBER_COLORS.length];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | Project["status"]>(
    "all"
  );
  const [showForm, setShowForm] = useState(false);

  const refresh = useCallback(() => {
    setProjects(getProjects());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered =
    statusFilter === "all"
      ? projects
      : projects.filter((p) => p.status === statusFilter);

  function handleCreate(
    data: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) {
    createProject(data);
    refresh();
    setShowForm(false);
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/15">
            <FolderKanban className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-sm text-gray-400">
              {projects.length} total projects
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a2e] border border-white/10">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
              className="bg-transparent text-sm text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((project) => {
          const sc = statusConfig[project.status];
          const StatusIcon = sc.icon;
          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="group rounded-xl bg-[#1a1a2e] border border-white/[0.06] p-5 hover:border-white/15 hover:bg-[#1e1e35] transition-all duration-200 cursor-pointer">
                {/* Color accent bar */}
                <div
                  className="h-1 w-12 rounded-full mb-4"
                  style={{ backgroundColor: project.color }}
                />

                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {project.name}
                  </h3>
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                      sc.className
                    )}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {sc.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span className="text-xs font-medium text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>
                </div>

                {/* Task Count */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-400">
                    <span className="text-white font-medium">
                      {project.completedTaskCount}
                    </span>
                    /{project.taskCount} tasks completed
                  </span>
                </div>

                {/* Footer: Members + Updated date */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  {/* Member Avatars */}
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((member, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#1a1a2e] group-hover:border-[#1e1e35] transition-colors"
                        style={{
                          backgroundColor: getMemberColor(member.name),
                        }}
                        title={member.name}
                      >
                        {member.initials}
                      </div>
                    ))}
                    {project.members.length > 4 && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium text-gray-400 bg-[#0f0f10] border-2 border-[#1a1a2e] group-hover:border-[#1e1e35] transition-colors">
                        +{project.members.length - 4}
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] text-gray-500">
                    Updated {format(new Date(project.updatedAt), "MMM d")}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-1">No projects found</p>
          <p className="text-sm text-gray-500">
            {statusFilter !== "all"
              ? "Try changing the status filter"
              : 'Click "New Project" to get started'}
          </p>
        </div>
      )}

      {/* New Project Form Modal */}
      {showForm && (
        <ProjectForm onSave={handleCreate} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
