# WorkNest

A modern collaborative project management platform built with Next.js, featuring real-time communication, Kanban-style task management, and team collaboration tools.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=flat-square&logo=tailwind-css)

## 🚀 Features

### Project Management

- Create, view, and delete projects
- Project dashboard with search and filtering
- Project member management (add/remove team members)

### Task Management

- Kanban board with drag-and-drop functionality
- Three columns: To Do, In Progress, Done
- Create, view, and update task status
- Task details view

### Real-time Collaboration

- Real-time chat with Socket.io
- Instant message delivery
- File sharing and uploads
- Live updates across all connected clients

### Authentication & Security

- JWT-based authentication
- Protected routes with middleware
- Session management with cookies

## 🛠️ Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 16 (App Router) |
| Language         | TypeScript              |
| Styling          | Tailwind CSS + DaisyUI  |
| State Management | Zustand                 |
| Server State     | TanStack React Query    |
| Real-time        | Socket.io Client        |
| Forms            | React Hook Form         |
| Validation       | Zod                     |
| Icons            | Lucide React            |
| Drag & Drop      | @hello-pangea/dnd       |

## 📁 Project Structure

```
work_nest/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/           # Protected dashboard routes
│   │   ├── project/
│   │   │   └── [projectId]/
│   │   └── settings/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/              # React components
│   ├── auth/               # Auth guards
│   ├── file/               # File management
│   ├── project/            # Project-related components
│   ├── skeleton/           # Loading skeletons
│   ├── socketProvider/    # Socket context
│   └── task/               # Task management
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useChatSocket.ts
│   ├── useProject.ts
│   ├── useProjectSocket.ts
│   └── useUser.ts
├── lib/                    # Libraries & utilities
│   ├── api.ts
│   ├── auth.ts
│   ├── axiosInstance.ts
│   ├── env.ts
│   └── socket.ts
├── services/               # API services
│   ├── auth.service.ts
│   ├── file.service.ts
│   ├── message.service.ts
│   ├── project.service.ts
│   ├── task.service.ts
│   └── user.service.ts
├── store/                  # Zustand stores
│   └── useAuthStore.ts
├── types/                  # TypeScript types
│   └── index.ts
└── utils/                  # Utility functions
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
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd work_nest

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🔌 API Integration

The frontend expects a backend API running at `http://localhost:5050` (or your configured API URL). The API should provide the following endpoints:

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Projects

- `GET /project` - Get user's projects
- `POST /project` - Create new project
- `GET /project/:id` - Get project details
- `DELETE /project/:id` - Delete project
- `GET /project/:id/members` - Get project members
- `POST /project/add-member` - Add member to project
- `POST /project/remove-member` - Remove member from project

### Tasks

- `GET /tasks/:projectId` - Get project tasks
- `POST /tasks` - Create new task
- `PATCH /tasks/:taskId` - Update task status
- `DELETE /tasks/:taskId` - Delete task

### Messages

- `GET /message/:projectId` - Get chat history
- `POST /message` - Send message

### Files

- `GET /file/:projectId` - Get project files
- `POST /file/upload` - Upload file
- `DELETE /file/:fileId` - Delete file

## 🎨 Customization

### Theme Colors

The primary color is configured in the Tailwind CSS. Update `app/globals.css` to customize the theme.

### Adding New Features

1. Create API service in `services/`
2. Add types in `types/index.ts`
3. Create components in `components/`
4. Add custom hooks in `hooks/` if needed
5. Integrate with React Query in pages

## 📄 License

This project is private and proprietary.

## 👤 Author

Built with ❤️ By Simon Adama using Next.js and modern web technologies.
