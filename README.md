# Project Manager

A feature-rich project management application built with Next.js 16, featuring task management with kanban boards, calendar scheduling, project tracking, and a polished dark-themed UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)

## Features

### Dashboard
- Overview stats (total tasks, in-progress, completed, overdue)
- Recent activity feed
- Quick action buttons
- Project progress summary

### Task Management
- **List view** with sorting and filtering by status, priority, and project
- **Kanban board** with drag-and-drop between columns (Todo, In Progress, In Review, Done)
- Task creation and editing with title, description, priority, due date, project, and tags
- Detail panel with full task information
- Priority levels: Urgent, High, Medium, Low
- Overdue task indicators

### Calendar
- **Monthly view** with event pills on each day
- **Weekly view** with time-slot grid
- Event creation and management
- Color-coded events by type
- Mini calendar sidebar for quick navigation

### Projects
- Project cards with progress bars and member avatars
- Individual project detail pages with SVG progress charts
- Task lists filtered by project
- Project timeline view
- Project creation modal

### Settings
- Profile management
- Appearance preferences
- Notification settings
- About section

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| date-fns | 4 | Date manipulation |
| Lucide React | 0.563 | Icon library |
| clsx | 2 | Conditional class names |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/cubev/project-manager.git
cd project-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with sidebar + header
│   ├── page.tsx                # Dashboard
│   ├── globals.css             # Dark theme + Tailwind config
│   ├── tasks/
│   │   └── page.tsx            # Task list + kanban views
│   ├── calendar/
│   │   └── page.tsx            # Calendar with monthly/weekly views
│   ├── projects/
│   │   ├── page.tsx            # Projects listing
│   │   └── [id]/page.tsx       # Project detail page
│   └── settings/
│       └── page.tsx            # Settings page
├── components/
│   ├── Sidebar.tsx             # Collapsible navigation sidebar
│   ├── Header.tsx              # Top bar with search + notifications
│   ├── TaskCard.tsx            # Draggable task card
│   ├── TaskForm.tsx            # Task create/edit modal
│   ├── TaskDetailPanel.tsx     # Task detail slide-over
│   ├── CalendarGrid.tsx        # Monthly calendar grid
│   ├── EventForm.tsx           # Event create/edit modal
│   ├── MiniCalendar.tsx        # Compact sidebar calendar
│   └── ProjectForm.tsx         # Project creation modal
├── store/
│   ├── taskStore.ts            # Task CRUD + localStorage
│   ├── calendarStore.ts        # Calendar event CRUD + localStorage
│   └── projectStore.ts         # Project CRUD + localStorage
└── types/
    └── index.ts                # Shared TypeScript types
```

## Data Persistence

All data is persisted to `localStorage` with the following keys:

- `pm-tasks` — Task data
- `pm-calendar-events` — Calendar events
- `pm-projects` — Project data

The app ships with seed data (10 tasks, 10 calendar events, 5 projects) that loads on first visit.

## License

MIT
