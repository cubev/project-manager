export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type ProjectStatus = "active" | "on_hold" | "completed" | "archived";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface ProjectMember {
  name: string;
  avatar: string;
  initials: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "on-hold" | "completed";
  color: string;
  progress: number;
  taskCount: number;
  completedTaskCount: number;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  projectId?: string;
  projectName?: string;
  assignee?: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  type: "meeting" | "deadline" | "milestone" | "reminder";
  projectId: string;
}

export interface Activity {
  id: string;
  type: "task_created" | "task_completed" | "project_created" | "comment_added" | "member_joined" | "task_updated";
  message: string;
  timestamp: string;
  user: User;
  projectId?: string;
}

export interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
}
