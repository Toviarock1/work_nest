# WorkNest

A full-stack collaborative project management platform built with Next.js and Node.js, featuring a 3D WebGL landing page, real-time presence, Kanban task boards, team chat, and file sharing.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=flat-square&logo=tailwind-css)
![Three.js](https://img.shields.io/badge/Three.js-0.184-black?style=flat-square&logo=three.js)
![Socket.io](https://img.shields.io/badge/Socket.io-client-black?style=flat-square&logo=socket.io)

## 🚀 Features

### 3D Landing Page

- Scroll-driven 3D scene built with Three.js and React Three Fiber
- Custom GLSL shaders, grid tunnel, node network, and cursor light
- Magnetic cursor with hover-reactive 3D shapes
- Parallax layers, scroll reveal animations, and tilt cards
- Fully responsive with WebGL detection and error boundary fallback

### Project Management

- Create, view, and delete projects
- Project dashboard with ⌘K search palette
- Breadcrumb navigation and project-level settings
- Mobile-first responsive layout with slide-out drawer navigation

### Task Management

- Kanban board with drag-and-drop (optimistic updates + rollback on failure)
- Three columns: To Do, In Progress, Done
- Subtasks, task attachments, and typed task links
- Task detail panel with live viewer presence (see who's viewing a task)
- Press `N` shortcut to create a new task

### Real-time Collaboration

- Real-time chat powered by Socket.io
- Live presence stack showing who's online in each project
- @mention autocomplete in chat and task comments with toast notifications
- Emoji reactions on messages
- File sharing in chat and task attachments (Supabase Storage)

### Authentication & Security

- JWT-based authentication with HttpOnly cookies
- Protected routes via AuthGuard middleware
- Rate-limited login endpoint (brute-force protection)
- Session management with Zustand + cookie persistence

### Monitoring & Analytics

- Sentry for frontend error tracking and performance monitoring
- PostHog for product analytics and user behaviour

## 🛠️ Tech Stack

| Category         | Technology                         |
| ---------------- | ---------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack) |
| Language         | TypeScript                         |
| Styling          | Tailwind CSS v4 + DaisyUI          |
| 3D / WebGL       | Three.js, React Three Fiber, Drei  |
| State Management | Zustand                            |
| Server State     | TanStack React Query               |
| Real-time        | Socket.io Client                   |
| Forms            | React Hook Form                    |
| Drag & Drop      | @hello-pangea/dnd                  |
| Icons            | Lucide React                       |
| Error Monitoring | Sentry                             |
| Analytics        | PostHog                            |

## 📁 Project Structure

```
work_nest/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Auth routes (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/             # Protected dashboard routes
│   │   ├── project/
│   │   │   └── [projectId]/   # Project detail (tasks, chat, files, members)
│   │   └── settings/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # 3D landing page
├── components/
│   ├── auth/                  # AuthGuard
│   ├── file/                  # File upload & viewer
│   ├── landing/               # LandingScene3D, MagneticCursor, TiltCard, etc.
│   ├── project/               # ChatPanel, ProjectMembers, PresenceStack, etc.
│   ├── skeleton/              # Loading skeletons
│   ├── task/                  # TaskBoard, AddTaskModal, ViewProjectTask, etc.
│   └── ui/                    # SearchPalette, MentionTextarea, QueryError, etc.
├── hooks/                     # Custom React hooks
│   ├── useChatSocket.ts
│   ├── useProjectAwareness.ts
│   ├── useProjectPresence.ts
│   └── useProjectSocket.ts
├── lib/                       # Libraries & utilities
│   ├── axiosInstance.ts
│   └── socket.ts
├── services/                  # API service layer
│   ├── auth.service.ts
│   ├── file.service.ts
│   ├── message.service.ts
│   ├── project.service.ts
│   ├── task.service.ts
│   └── user.service.ts
├── store/                     # Zustand stores
│   └── useAuthStore.ts
├── types/                     # TypeScript types
│   └── index.ts
└── utils/                     # Utility functions
    ├── fonts.ts
    ├── formatData.ts
    └── helpers.ts
```

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050
NEXT_PUBLIC_SOCKET_URL=http://localhost:5050
NODE_ENV=development
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun
- WorkNest Backend running (see [WorkNest Backend](https://github.com/Toviarock1/worknest-backend))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd work_nest

# Install dependencies
npm install
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Build

```bash
npm run build
npm run start
```

## 🔌 Backend

This frontend requires the [WorkNest Backend](https://github.com/Toviarock1/worknest-backend) to be running. See that repo for API documentation and setup instructions.

## 🎨 Theme

Primary color and design tokens are configured in `app/globals.css` under `@theme`. The app supports light and dark mode via `prefers-color-scheme`.

## 👤 Author

Built by [Simon Adama](https://simonadama.vercel.app/) — Full-Stack Engineer.
