"use client";

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/calendar": "Calendar",
  "/settings": "Settings",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="flex items-center justify-between h-16 px-8 border-b border-border-secondary bg-bg-secondary/50 backdrop-blur-sm">
      {/* Page title */}
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-9 pl-9 pr-4 text-sm bg-bg-tertiary border border-border-secondary rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/25 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-bg-hover transition-colors">
          <Bell className="w-[18px] h-[18px] text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border-secondary">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center">
            <span className="text-xs font-semibold text-white">JD</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-primary leading-none">
              John Doe
            </p>
            <p className="text-xs text-text-muted mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
