"use client";

import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  Clock,
  UserPlus,
  MessageSquare,
  Zap,
} from "lucide-react";
import clsx from "clsx";

const stats = [
  {
    title: "Total Projects",
    value: 12,
    change: "+2 this month",
    changeType: "positive" as const,
    icon: FolderKanban,
    gradient: "from-accent-indigo to-accent-purple",
  },
  {
    title: "Active Tasks",
    value: 48,
    change: "+5 this week",
    changeType: "positive" as const,
    icon: CheckSquare,
    gradient: "from-accent-blue to-accent-indigo",
  },
  {
    title: "Completed",
    value: 156,
    change: "+12 this week",
    changeType: "positive" as const,
    icon: CheckCircle2,
    gradient: "from-accent-green to-emerald-400",
  },
  {
    title: "Overdue",
    value: 3,
    change: "-2 from last week",
    changeType: "negative" as const,
    icon: AlertTriangle,
    gradient: "from-accent-amber to-orange-400",
  },
];

const recentActivity = [
  {
    id: "1",
    type: "task_completed",
    message: "Completed 'Design system tokens' in Brand Refresh",
    timestamp: "10 minutes ago",
    icon: CheckCircle2,
    iconColor: "text-accent-green",
  },
  {
    id: "2",
    type: "member_joined",
    message: "Sarah Chen joined the Mobile App project",
    timestamp: "1 hour ago",
    icon: UserPlus,
    iconColor: "text-accent-indigo",
  },
  {
    id: "3",
    type: "comment_added",
    message: "New comment on 'API integration specs'",
    timestamp: "2 hours ago",
    icon: MessageSquare,
    iconColor: "text-accent-purple",
  },
  {
    id: "4",
    type: "task_created",
    message: "Created 'User onboarding flow' in Dashboard Redesign",
    timestamp: "3 hours ago",
    icon: Plus,
    iconColor: "text-accent-blue",
  },
  {
    id: "5",
    type: "task_completed",
    message: "Completed 'Database migration script' in Backend v2",
    timestamp: "5 hours ago",
    icon: CheckCircle2,
    iconColor: "text-accent-green",
  },
];

const quickActions = [
  {
    label: "New Project",
    description: "Start a new project from scratch",
    icon: FolderKanban,
    gradient: "from-accent-indigo to-accent-purple",
  },
  {
    label: "Add Task",
    description: "Create a task in any project",
    icon: CheckSquare,
    gradient: "from-accent-blue to-accent-indigo",
  },
  {
    label: "Schedule Event",
    description: "Add an event to the calendar",
    icon: Clock,
    gradient: "from-accent-purple to-pink-500",
  },
  {
    label: "Quick Note",
    description: "Jot down a quick note or idea",
    icon: Zap,
    gradient: "from-accent-amber to-orange-400",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-bg-secondary border border-border-secondary rounded-xl p-5 hover:border-border-primary transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={clsx(
                    "flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br",
                    stat.gradient
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="w-3 h-3 text-accent-green" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-accent-red" />
                  )}
                  <span
                    className={clsx(
                      stat.changeType === "positive"
                        ? "text-accent-green"
                        : "text-accent-red"
                    )}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-sm text-text-muted mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-bg-secondary border border-border-secondary rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-border-secondary">
            <h2 className="text-base font-semibold text-text-primary">
              Recent Activity
            </h2>
            <button className="flex items-center gap-1 text-xs text-accent-indigo hover:text-accent-indigo-hover transition-colors">
              View all
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border-secondary">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-4 hover:bg-bg-hover/50 transition-colors"
                >
                  <div
                    className={clsx(
                      "flex items-center justify-center w-8 h-8 rounded-lg bg-bg-tertiary shrink-0 mt-0.5",
                    )}
                  >
                    <Icon className={clsx("w-4 h-4", activity.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">
                      {activity.message}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-bg-secondary border border-border-secondary rounded-xl">
          <div className="p-5 border-b border-border-secondary">
            <h2 className="text-base font-semibold text-text-primary">
              Quick Actions
            </h2>
          </div>
          <div className="p-3 space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-bg-hover transition-colors text-left group"
                >
                  <div
                    className={clsx(
                      "flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br shrink-0",
                      action.gradient
                    )}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary group-hover:text-accent-indigo-hover transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-text-muted">
                      {action.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
