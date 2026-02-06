export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  color: string;
}

const STORAGE_KEY = 'pm-tasks';

export const sampleProjects: ProjectInfo[] = [
  { id: 'proj-1', name: 'Website Redesign', color: '#6366f1' },
  { id: 'proj-2', name: 'Mobile App', color: '#8b5cf6' },
  { id: 'proj-3', name: 'API Platform', color: '#a78bfa' },
  { id: 'proj-4', name: 'Marketing Site', color: '#c084fc' },
];

export const seedTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design new landing page wireframes',
    description:
      'Create detailed wireframes for the redesigned landing page including hero section, features grid, pricing table, and testimonials carousel. Must be responsive for mobile, tablet, and desktop breakpoints.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-02-10',
    projectId: 'proj-1',
    tags: ['design', 'ui/ux'],
    createdAt: '2026-01-28T09:00:00Z',
    updatedAt: '2026-02-04T14:30:00Z',
  },
  {
    id: 'task-2',
    title: 'Implement user authentication flow',
    description:
      'Build the complete authentication system with login, registration, password reset, and email verification. Integrate with OAuth providers (Google, GitHub). Include rate limiting and security headers.',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2026-02-08',
    projectId: 'proj-2',
    tags: ['backend', 'security', 'auth'],
    createdAt: '2026-01-30T10:00:00Z',
    updatedAt: '2026-01-30T10:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Set up CI/CD pipeline for staging',
    description:
      'Configure GitHub Actions workflow for automated testing, linting, and deployment to the staging environment. Include Docker build steps and Kubernetes deployment manifests.',
    status: 'done',
    priority: 'high',
    dueDate: '2026-02-01',
    projectId: 'proj-3',
    tags: ['devops', 'ci/cd'],
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-02-01T16:45:00Z',
  },
  {
    id: 'task-4',
    title: 'Write API documentation for v2 endpoints',
    description:
      'Document all new v2 REST API endpoints using OpenAPI/Swagger specification. Include request/response examples, error codes, authentication requirements, and rate limit details.',
    status: 'in-review',
    priority: 'medium',
    dueDate: '2026-02-12',
    projectId: 'proj-3',
    tags: ['docs', 'api'],
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-02-05T09:15:00Z',
  },
  {
    id: 'task-5',
    title: 'Fix navigation menu on mobile devices',
    description:
      'The hamburger menu does not close after selecting a navigation item on iOS Safari and some Android browsers. Also fix the z-index overlap with the sticky header on scroll.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-02-07',
    projectId: 'proj-1',
    tags: ['bug', 'mobile', 'css'],
    createdAt: '2026-02-03T15:00:00Z',
    updatedAt: '2026-02-03T15:00:00Z',
  },
  {
    id: 'task-6',
    title: 'Optimize database queries for dashboard',
    description:
      'Profile and optimize the slow SQL queries powering the analytics dashboard. Add proper indexes, implement query caching with Redis, and consider materialized views for aggregate data.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-02-14',
    projectId: 'proj-3',
    tags: ['performance', 'database'],
    createdAt: '2026-02-02T13:00:00Z',
    updatedAt: '2026-02-05T11:00:00Z',
  },
  {
    id: 'task-7',
    title: 'Create onboarding tutorial flow',
    description:
      'Design and implement an interactive onboarding tutorial for new users. Include tooltips, step-by-step guides, and progress tracking. Should be skippable and resumable.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-02-20',
    projectId: 'proj-2',
    tags: ['feature', 'ux'],
    createdAt: '2026-02-04T09:00:00Z',
    updatedAt: '2026-02-04T09:00:00Z',
  },
  {
    id: 'task-8',
    title: 'Integrate payment processing with Stripe',
    description:
      'Set up Stripe integration for subscription billing. Implement checkout flow, webhook handlers for payment events, invoice generation, and subscription management (upgrade/downgrade/cancel).',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2026-02-09',
    projectId: 'proj-4',
    tags: ['payments', 'integration'],
    createdAt: '2026-01-29T14:00:00Z',
    updatedAt: '2026-01-29T14:00:00Z',
  },
  {
    id: 'task-9',
    title: 'Implement dark mode theme toggle',
    description:
      'Add system-aware dark mode with manual toggle override. Ensure all components properly support both themes. Store user preference in localStorage and sync across tabs.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-01-31',
    projectId: 'proj-1',
    tags: ['ui/ux', 'feature'],
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-01-31T12:00:00Z',
  },
  {
    id: 'task-10',
    title: 'Conduct security audit of API endpoints',
    description:
      'Perform comprehensive security review of all public API endpoints. Check for SQL injection, XSS, CSRF, broken authentication, and excessive data exposure. Document findings and remediation steps.',
    status: 'in-review',
    priority: 'urgent',
    dueDate: '2026-02-06',
    projectId: 'proj-3',
    tags: ['security', 'audit'],
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-05T17:30:00Z',
  },
];

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return seedTasks;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Task[];
    }
  } catch {
    // ignore parse errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTasks));
  return seedTasks;
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function createTask(
  tasks: Task[],
  data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
): Task[] {
  const now = new Date().toISOString();
  const newTask: Task = {
    ...data,
    id: `task-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  const updated = [newTask, ...tasks];
  saveTasks(updated);
  return updated;
}

export function updateTask(
  tasks: Task[],
  id: string,
  data: Partial<Omit<Task, 'id' | 'createdAt'>>
): Task[] {
  const updated = tasks.map((t) =>
    t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
  );
  saveTasks(updated);
  return updated;
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  const updated = tasks.filter((t) => t.id !== id);
  saveTasks(updated);
  return updated;
}

export const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  done: 'Done',
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};
