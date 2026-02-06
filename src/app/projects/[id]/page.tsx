"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  PauseCircle,
  Edit3,
  Trash2,
  ListTodo,
  Users,
  Activity,
  BarChart3,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import { Project } from "@/types";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/store/projectStore";
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

function getProjectActivities(project: Project) {
  return [
    {
      id: "a1",
      type: "task_completed" as const,
      message: `Completed "Update navigation component"`,
      timestamp: "2026-02-06T08:30:00Z",
      user: project.members[0]?.name ?? "Team Member",
    },
    {
      id: "a2",
      type: "comment" as const,
      message: "Added review notes to the design specs",
      timestamp: "2026-02-05T16:20:00Z",
      user: project.members[1]?.name ?? "Team Member",
    },
    {
      id: "a3",
      type: "task_created" as const,
      message: `Created task "Implement dark mode toggle"`,
      timestamp: "2026-02-05T11:00:00Z",
      user: project.members[0]?.name ?? "Team Member",
    },
    {
      id: "a4",
      type: "member_joined" as const,
      message: "Joined the project team",
      timestamp: "2026-02-04T09:00:00Z",
      user:
        project.members[project.members.length - 1]?.name ?? "Team Member",
    },
    {
      id: "a5",
      type: "task_completed" as const,
      message: `Completed "Set up CI/CD pipeline"`,
      timestamp: "2026-02-03T14:45:00Z",
      user: project.members[0]?.name ?? "Team Member",
    },
  ];
}

function getProjectTasks(project: Project) {
  const taskNames = [
    "Update navigation component",
    "Implement dark mode toggle",
    "Set up CI/CD pipeline",
    "Write unit tests for auth module",
    "Design new landing page",
    "Optimize database queries",
    "Create API documentation",
    "Fix responsive layout issues",
  ];
  return taskNames
    .slice(0, Math.min(taskNames.length, project.taskCount))
    .map((title, i) => ({
      id: `t-${i}`,
      title,
      completed: i < project.completedTaskCount,
      priority: (["high", "medium", "low"] as const)[i % 3],
    }));
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const loadProject = useCallback(() => {
    const id = params.id as string;
    const p = getProjectById(id);
    if (p) setProject(p);
  }, [params.id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Project not found</p>
          <Link
            href="/projects"
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const sc = statusConfig[project.status];
  const StatusIcon = sc.icon;
  const tasks = getProjectTasks(project);
  const activities = getProjectActivities(project);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset =
    circumference - (project.progress / 100) * circumference;

  function handleUpdate(
    data: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) {
    if (!project) return;
    updateProject(project.id, data);
    loadProject();
    setShowEditForm(false);
  }

  function handleDelete() {
    if (!project) return;
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(project.id);
      router.push("/projects");
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Back Button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div className="rounded-xl bg-[#1a1a2e] border border-white/[0.06] p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-3 h-12 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {project.name}
              </h1>
              <p className="text-gray-400 mb-3 max-w-2xl">
                {project.description}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
                    sc.className
                  )}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {sc.label}
                </span>
                <span className="text-xs text-gray-500">
                  Created {format(new Date(project.createdAt), "MMM d, yyyy")}
                </span>
                <span className="text-xs text-gray-500">
                  Updated{" "}
                  {formatDistanceToNow(new Date(project.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 border border-white/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Progress + Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <div className="rounded-xl bg-[#1a1a2e] border border-white/[0.06] p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">
                Progress Overview
              </h2>
            </div>

            <div className="flex items-center gap-8">
              {/* Circular Progress */}
              <div className="relative flex-shrink-0">
                <svg width="128" height="128" className="-rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    fill="none"
                    stroke={project.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {project.progress}%
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="rounded-lg bg-[#0f0f10] p-4">
                  <p className="text-xs text-gray-400 mb-1">Total Tasks</p>
                  <p className="text-xl font-bold text-white">
                    {project.taskCount}
                  </p>
                </div>
                <div className="rounded-lg bg-[#0f0f10] p-4">
                  <p className="text-xs text-gray-400 mb-1">Completed</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {project.completedTaskCount}
                  </p>
                </div>
                <div className="rounded-lg bg-[#0f0f10] p-4">
                  <p className="text-xs text-gray-400 mb-1">Remaining</p>
                  <p className="text-xl font-bold text-amber-400">
                    {project.taskCount - project.completedTaskCount}
                  </p>
                </div>
                <div className="rounded-lg bg-[#0f0f10] p-4">
                  <p className="text-xs text-gray-400 mb-1">Team Size</p>
                  <p className="text-xl font-bold text-indigo-400">
                    {project.members.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="rounded-xl bg-[#1a1a2e] border border-white/[0.06] p-6">
            <div className="flex items-center gap-2 mb-5">
              <ListTodo className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">Tasks</h2>
              <span className="ml-auto text-xs text-gray-500">
                {project.completedTaskCount}/{project.taskCount} done
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors",
                    task.completed
                      ? "bg-white/[0.02] border-white/[0.04]"
                      : "bg-[#0f0f10] border-white/[0.06] hover:border-white/10"
                  )}
                >
                  <div
                    className={clsx(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      task.completed
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-600"
                    )}
                  >
                    {task.completed && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span
                    className={clsx(
                      "text-sm flex-1",
                      task.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-200"
                    )}
                  >
                    {task.title}
                  </span>
                  <span
                    className={clsx(
                      "px-2 py-0.5 rounded text-[10px] font-medium uppercase",
                      task.priority === "high" &&
                        "bg-red-500/15 text-red-400",
                      task.priority === "medium" &&
                        "bg-amber-500/15 text-amber-400",
                      task.priority === "low" &&
                        "bg-blue-500/15 text-blue-400"
                    )}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Members + Activity */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="rounded-xl bg-[#1a1a2e] border border-white/[0.06] p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">
                Team Members
              </h2>
              <span className="ml-auto text-xs text-gray-500">
                {project.members.length}
              </span>
            </div>

            <div className="space-y-3">
              {project.members.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      backgroundColor: getMemberColor(member.name),
                    }}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500">Team member</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-xl bg-[#1a1a2e] border border-white/[0.06] p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">
                Recent Activity
              </h2>
            </div>

            <div className="space-y-4">
              {activities.map((activity, i) => (
                <div key={activity.id} className="relative flex gap-3">
                  {i < activities.length - 1 && (
                    <div className="absolute left-[11px] top-6 w-0.5 h-full bg-white/[0.06]" />
                  )}
                  <div
                    className={clsx(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      activity.type === "task_completed" &&
                        "bg-emerald-500/20",
                      activity.type === "task_created" &&
                        "bg-indigo-500/20",
                      activity.type === "comment" && "bg-amber-500/20",
                      activity.type === "member_joined" &&
                        "bg-purple-500/20"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-2 h-2 rounded-full",
                        activity.type === "task_completed" &&
                          "bg-emerald-400",
                        activity.type === "task_created" &&
                          "bg-indigo-400",
                        activity.type === "comment" && "bg-amber-400",
                        activity.type === "member_joined" &&
                          "bg-purple-400"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-white">
                        {activity.user}
                      </span>{" "}
                      {activity.message}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <ProjectForm
          project={project}
          onSave={handleUpdate}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
}
