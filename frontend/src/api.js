import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const signup = (data) => API.post('/api/auth/signup', data);
export const login = (data) => API.post('/api/auth/login', data);

export const getProjects = () => API.get('/api/projects');
export const createProject = (data) => API.post('/api/projects', data);
export const getProject = (id) => API.get(`/api/projects/${id}`);
export const deleteProject = (id) => API.delete(`/api/projects/${id}`);

export const createTask = (projectId, data) => API.post(`/api/projects/${projectId}/tasks`, data);
export const updateTask = (taskId, data) => API.patch(`/api/tasks/${taskId}`, data);
export const deleteTask = (taskId) => API.delete(`/api/tasks/${taskId}`);

export const addMember = (projectId, data) => API.post(`/api/projects/${projectId}/members`, data);
export const removeMember = (projectId, userId) => API.delete(`/api/projects/${projectId}/members/${userId}`);

export const getDashboard = () => API.get('/api/tasks/dashboard');