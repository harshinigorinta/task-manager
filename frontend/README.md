# Task Manager — Full Stack Web App

A full-stack team task management application with role-based access control, built with Node.js, Express, PostgreSQL, and React.

## 🌐 Live Demo

**Frontend:** https://surprising-unity-production-60c3.up.railway.app

**Backend API:** https://task-manager-production-ab1e.up.railway.app

## 📸 Features

- **Authentication** — Signup and login with JWT tokens
- **Projects** — Create and manage multiple projects
- **Team Management** — Add members with Admin or Member roles
- **Tasks** — Create tasks with title, description, priority, due date, and assignee
- **Kanban Board** — Move tasks between To Do, In Progress, and Done
- **Dashboard** — View total tasks, in-progress, completed, and overdue tasks
- **Role-based Access** — Only Admins can add members and delete tasks

## 🛠 Tech Stack

### Backend
- Node.js + Express
- PostgreSQL (hosted on Railway)
- Prisma ORM
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Context API for auth state

### Deployment
- Railway (backend + frontend + database)

## 📁 Project Structure
task-manager/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── role.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   └── members.js
│   │   └── app.js
│   └── package.json
└── frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   └── ProjectDetail.jsx
│   ├── api.js
│   └── main.jsx
└── package.json
## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
DATABASE_URL="postgresql://postgres:YOURPASSWORD@localhost:5432/taskmanager"
JWT_SECRET="mysupersecretkey123"
PORT=5000
Run database migrations:
```bash
npx prisma migrate dev --name init
```

Start the backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:
VITE_API_URL=http://localhost:5000
Start the frontend:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🔗 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/signup | Public | Register new user |
| POST | /api/auth/login | Public | Login user |
| GET | /api/projects | Auth | Get all projects |
| POST | /api/projects | Auth | Create project |
| GET | /api/projects/:id | Auth | Get project details |
| POST | /api/projects/:id/members | Admin | Add member |
| DELETE | /api/projects/:id/members/:userId | Admin | Remove member |
| POST | /api/projects/:id/tasks | Auth | Create task |
| PATCH | /api/tasks/:id | Auth | Update task |
| DELETE | /api/tasks/:id | Auth | Delete task |
| GET | /api/tasks/dashboard | Auth | Get dashboard stats |

## 🔐 Role-Based Access

| Feature | Admin | Member |
|---------|-------|--------|
| Create tasks | ✅ | ✅ |
| Update task status | ✅ | ✅ |
| Delete tasks | ✅ | ❌ |
| Add members | ✅ | ❌ |
| Remove members | ✅ | ❌ |

## 👩‍💻 Developer

**Harshini Gorinta**
GitHub: [@harshinigorinta](https://github.com/harshinigorinta)