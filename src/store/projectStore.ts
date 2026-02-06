"use client";

import { Project, ProjectMember } from "@/types";

const STORAGE_KEY = "pm-projects";

const sampleMembers: Record<string, ProjectMember[]> = {
  design: [
    { name: "Alice Chen", avatar: "", initials: "AC" },
    { name: "Bob Rivera", avatar: "", initials: "BR" },
    { name: "Cara Nguyen", avatar: "", initials: "CN" },
  ],
  mobile: [
    { name: "Dan Park", avatar: "", initials: "DP" },
    { name: "Emily Sato", avatar: "", initials: "ES" },
    { name: "Alice Chen", avatar: "", initials: "AC" },
    { name: "Frank Lee", avatar: "", initials: "FL" },
  ],
  marketing: [
    { name: "Grace Kim", avatar: "", initials: "GK" },
    { name: "Bob Rivera", avatar: "", initials: "BR" },
  ],
  api: [
    { name: "Dan Park", avatar: "", initials: "DP" },
    { name: "Emily Sato", avatar: "", initials: "ES" },
    { name: "Henry Wu", avatar: "", initials: "HW" },
  ],
  planning: [
    { name: "Alice Chen", avatar: "", initials: "AC" },
    { name: "Grace Kim", avatar: "", initials: "GK" },
    { name: "Frank Lee", avatar: "", initials: "FL" },
    { name: "Henry Wu", avatar: "", initials: "HW" },
    { name: "Bob Rivera", avatar: "", initials: "BR" },
  ],
};

const seedProjects: Project[] = [
  {
    id: "proj-1",
    name: "Website Redesign",
    description:
      "Complete overhaul of the company website with modern design, improved UX, and mobile-first approach.",
    status: "active",
    color: "#6366f1",
    progress: 68,
    taskCount: 24,
    completedTaskCount: 16,
    members: sampleMembers.design,
    createdAt: "2025-12-01T09:00:00Z",
    updatedAt: "2026-02-04T14:30:00Z",
  },
  {
    id: "proj-2",
    name: "Mobile App v2",
    description:
      "Second major release of the mobile application featuring offline mode, push notifications, and redesigned navigation.",
    status: "active",
    color: "#8b5cf6",
    progress: 42,
    taskCount: 36,
    completedTaskCount: 15,
    members: sampleMembers.mobile,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-02-05T11:20:00Z",
  },
  {
    id: "proj-3",
    name: "Marketing Campaign",
    description:
      "Q1 digital marketing campaign across social media, email, and content channels to drive user acquisition.",
    status: "on-hold",
    color: "#ec4899",
    progress: 25,
    taskCount: 12,
    completedTaskCount: 3,
    members: sampleMembers.marketing,
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-01-28T16:45:00Z",
  },
  {
    id: "proj-4",
    name: "API Integration Layer",
    description:
      "Build a unified API gateway and integration layer connecting internal microservices with third-party APIs.",
    status: "active",
    color: "#14b8a6",
    progress: 85,
    taskCount: 18,
    completedTaskCount: 15,
    members: sampleMembers.api,
    createdAt: "2025-11-15T09:00:00Z",
    updatedAt: "2026-02-06T09:10:00Z",
  },
  {
    id: "proj-5",
    name: "Q1 Strategic Planning",
    description:
      "Define quarterly OKRs, resource allocation, and strategic initiatives for the engineering and product teams.",
    status: "completed",
    color: "#f59e0b",
    progress: 100,
    taskCount: 10,
    completedTaskCount: 10,
    members: sampleMembers.planning,
    createdAt: "2025-12-15T09:00:00Z",
    updatedAt: "2026-01-31T17:00:00Z",
  },
];

function loadProjects(): Project[] {
  if (typeof window === "undefined") return seedProjects;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProjects));
  return seedProjects;
}

function saveProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjects(): Project[] {
  return loadProjects();
}

export function getProjectById(id: string): Project | undefined {
  return loadProjects().find((p) => p.id === id);
}

export function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">
): Project {
  const projects = loadProjects();
  const newProject: Project = {
    ...data,
    id: `proj-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.unshift(newProject);
  saveProjects(projects);
  return newProject;
}

export function updateProject(
  id: string,
  data: Partial<Omit<Project, "id" | "createdAt">>
): Project | undefined {
  const projects = loadProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  projects[index] = {
    ...projects[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveProjects(projects);
  return projects[index];
}

export function deleteProject(id: string): boolean {
  const projects = loadProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  saveProjects(filtered);
  return true;
}
