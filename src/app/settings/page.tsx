"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Palette,
  Bell,
  Info,
  Camera,
  Check,
} from "lucide-react";
import clsx from "clsx";

const ACCENT_COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Red", value: "#ef4444" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
];

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const [profileName, setProfileName] = useState("Alex Johnson");
  const [profileEmail, setProfileEmail] = useState("alex@company.com");
  const [accentColor, setAccentColor] = useState("#6366f1");
  const [darkMode, setDarkMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "task-assigned",
      label: "Task Assignments",
      description: "Get notified when a task is assigned to you",
      enabled: true,
    },
    {
      id: "task-completed",
      label: "Task Completions",
      description: "Get notified when tasks in your projects are completed",
      enabled: true,
    },
    {
      id: "project-updates",
      label: "Project Updates",
      description: "Get notified about project status changes",
      enabled: false,
    },
    {
      id: "mentions",
      label: "Mentions",
      description: "Get notified when someone mentions you in a comment",
      enabled: true,
    },
    {
      id: "daily-digest",
      label: "Daily Digest",
      description: "Receive a daily summary of activity across your projects",
      enabled: false,
    },
  ]);

  function toggleNotification(id: string) {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      )
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-indigo-500/15">
          <Settings className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Section */}
        <div className="rounded-xl bg-[#1a1a2e] border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Profile</h2>
          </div>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                AJ
              </div>
              <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0f0f10] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0f0f10] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="rounded-xl bg-[#1a1a2e] border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Palette className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Appearance</h2>
          </div>

          <div className="space-y-5">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Dark Mode</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Use dark theme across the application
                </p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={clsx(
                  "relative w-11 h-6 rounded-full transition-colors",
                  darkMode ? "bg-indigo-600" : "bg-gray-600"
                )}
              >
                <div
                  className={clsx(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    darkMode ? "translate-x-[22px]" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>

            {/* Accent Color */}
            <div>
              <p className="text-sm font-medium text-white mb-1">
                Accent Color
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Choose the primary accent color for the interface
              </p>
              <div className="flex gap-3 flex-wrap">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setAccentColor(c.value)}
                    className={clsx(
                      "w-9 h-9 rounded-full transition-all flex items-center justify-center",
                      accentColor === c.value
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1a2e] scale-110"
                        : "hover:scale-110"
                    )}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {accentColor === c.value && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="rounded-xl bg-[#1a1a2e] border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {notif.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {notif.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleNotification(notif.id)}
                  className={clsx(
                    "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
                    notif.enabled ? "bg-indigo-600" : "bg-gray-600"
                  )}
                >
                  <div
                    className={clsx(
                      "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                      notif.enabled
                        ? "translate-x-[22px]"
                        : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="rounded-xl bg-[#1a1a2e] border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Info className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">About</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">Application</span>
              <span className="text-white font-medium">Project Manager</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">Version</span>
              <span className="text-white font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">Built with</span>
              <span className="text-white font-medium">
                Next.js + TypeScript
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">License</span>
              <span className="text-white font-medium">MIT</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            className={clsx(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
              saved
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            )}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
