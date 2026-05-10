# TaskManager Pro

> A full-stack team collaboration and task management platform with role-based access control, real-time project tracking, and a Kanban-style task board.

![Live](https://img.shields.io/badge/Live-Online-brightgreen)
![Node](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Deployed on Railway](https://img.shields.io/badge/Deployed%20on-Railway-blueviolet)

---

## 🌐 Live Application

| Service | URL |
|--------|-----|
| **Frontend** | https://surprising-unity-production-60c3.up.railway.app |
| **Backend API** | https://task-manager-production-ab1e.up.railway.app |
| **GitHub Repository** | https://github.com/harshinigorinta/task-manager |

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Role-Based Access Control](#role-based-access-control)
- [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## Overview

TaskManager Pro is a production-ready web application that enables teams to organize work, assign responsibilities, and track project progress. It supports multiple projects, team collaboration with role-based permissions, and a visual Kanban board for task management.

---

## ✨ Features

### Authentication & Security
- Secure user registration and login
- JWT-based authentication with 7-day token expiry
- Bcrypt password hashing
- Protected routes on both frontend and backend

### Project Management
- Create and manage unlimited projects
- Invite team members via email
- Assign roles — Admin or Member — per project
- View all projects from a central dashboard

### Task Management
- Create tasks with title, description, priority, assignee, and due date
- Kanban board with three columns — To Do, In Progress, Done
- Update task status with a single click
- Priority levels — Low, Medium, High
- Admin-only task deletion

### Dashboard & Analytics
- Total tasks count
- In-progress tasks count
- Completed tasks count
- Overdue tasks list with project reference

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| PostgreSQL | Relational database |
| Prisma ORM | Database queries and migrations |
| JSON Web Tokens | Authentication |
| bcryptjs | Password encryption |
| CORS | Cross-origin resource sharing |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework and build tool |
| React Router DOM | Client-side routing |
| Axios | HTTP requests with interceptors |
| Context API | Global authentication state |

### Deployment
| Service | Purpose |
|--------|---------|
| Railway | Backend hosting |
| Railway | Frontend hosting |
| Railway PostgreSQL | Managed database |
| GitHub | Version control and CI/CD |

---

## 🏗 System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │  HTTPS  │                 │  Prisma │                 │
│  React Frontend │ ──────► │  Express API    │ ──────► │   PostgreSQL    │
│  (Railway)      │         │  (Railway)      │         │   (Railway)     │
│                 │ ◄────── │                 │ ◄────── │                 │
└─────────────────┘  JSON   └─────────────────┘  ORM   └─────────────────┘
```

---

## 🗄 Database Schema

```
User
├── id (uuid, primary key)
├── name
├── email (unique)
├── password (hashed)
└── createdAt

Project
├── id (uuid, primary key)
├── name
├── description
└── createdAt

ProjectMember (junction table)
├── id (uuid, primary key)
├── role (ADMIN | MEMBER)
├── userId → User
└── projectId → Project

Task
├── id (uuid, primary key)
├── title
├── description
├── status (TODO | IN_PROGRESS | DONE)
├── priority (LOW | MEDIUM | HIGH)
├── dueDate
├── projectId → Project
├── assigneeId → User
├── creatorId → User
└── createdAt
```

---

## 📡 API Documentation

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |

**Signup request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Login response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Projects

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/projects` | Auth | Get all projects for current user |
| POST | `/api/projects` | Auth | Create a new project |
| GET | `/api/projects/:id` | Auth | Get project details with tasks |
| DELETE | `/api/projects/:id` | Admin | Delete a project |

### Tasks

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/projects/:id/tasks` | Auth | Create a task in a project |
| PATCH | `/api/tasks/:id` | Auth | Update task details or status |
| DELETE | `/api/tasks/:id` | Admin | Delete a task |
| GET | `/api/tasks/dashboard` | Auth | Get dashboard statistics |

### Members

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/projects/:id/members` | Admin | Add a member by email |
| DELETE | `/api/projects/:id/members/:userId` | Admin | Remove a member |

---

## 🔐 Role-Based Access Control

Every project member has a role that controls what they can do.

| Action | Admin | Member |
|--------|-------|--------|
| View project and tasks | ✅ | ✅ |
| Create tasks | ✅ | ✅ |
| Update task status | ✅ | ✅ |
| Delete tasks | ✅ | ❌ |
| Add team members | ✅ | ❌ |
| Remove team members | ✅ | ❌ |
| Delete project | ✅ | ❌ |

The project creator is automatically assigned the **Admin** role.

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Git

### 1. Clone the repository

```bash
git clone https://github.com/harshinigorinta/task-manager.git
cd task-manager
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:YOURPASSWORD@localhost:5432/taskmanager"
JWT_SECRET="your-secret-key-here"
PORT=5000
```

Create the database and run migrations:
```bash
psql -U postgres -c "CREATE DATABASE taskmanager;"
npx prisma migrate dev --name init
```

Start the backend server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## ☁️ Deployment

This project is deployed on **Railway** using two separate services.

### Backend service
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npx prisma migrate deploy && node src/app.js`
- Environment variables: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `PORT`

### Frontend service
- Root directory: `frontend`
- Build command: `npm run build`
- Start command: `npm run preview -- --host 0.0.0.0 --port 3000`
- Environment variables: `VITE_API_URL`

### Database
- Railway managed PostgreSQL
- Auto-connected via `DATABASE_URL` reference variable

---

## 📁 Project Structure

```
task-manager/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database models
│   │   └── migrations/            # Migration history
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification
│   │   │   └── role.js            # Role-based access guard
│   │   ├── routes/
│   │   │   ├── auth.js            # Signup and login
│   │   │   ├── projects.js        # Project CRUD
│   │   │   ├── tasks.js           # Task CRUD and dashboard
│   │   │   └── members.js         # Team member management
│   │   └── app.js                 # Express app entry point
│   ├── .env                       # Environment variables (not committed)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Signup.jsx         # Registration page
    │   │   ├── Dashboard.jsx      # Main dashboard
    │   │   └── ProjectDetail.jsx  # Kanban board and team
    │   ├── api.js                 # Axios API functions
    │   └── main.jsx               # App entry and routing
    ├── .env                       # Environment variables (not committed)
    └── package.json
```

---

## 👩‍💻 Developer

**Harshini Gorinta**

- GitHub: [@harshinigorinta](https://github.com/harshinigorinta)
- Email: harshinigorinta4@gmail.com

---

