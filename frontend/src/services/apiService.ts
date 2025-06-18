import axios from 'axios';
import { API } from '../config/api';

// Create axios instance for easy config management
const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login or show auth modal
    }
    return Promise.reject(error);
  }
);

// Agent Service
export const agentService = {
  getAll: () => apiClient.get(API.agents),
  getById: (id) => apiClient.get(API.agentById(id)),
  getByType: (type) => apiClient.get(API.agentsByType(type)),
  create: (data) => apiClient.post(API.agents, data),
  update: (id, data) => apiClient.patch(API.agentById(id), data),
  delete: (id) => apiClient.delete(API.agentById(id)),
  recordUsage: (id, data) => apiClient.post(API.agentUsage(id), data),
};

// File Service
export const fileService = {
  getAll: () => apiClient.get(API.files),
  getById: (id) => apiClient.get(API.fileById(id)),
  upload: (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    return apiClient.post(API.fileUpload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  process: (id, options = {}) => apiClient.post(API.fileProcess(id), options),
  getAnalysis: (id) => apiClient.get(API.fileAnalysis(id)),
  update: (id, data) => apiClient.patch(API.fileById(id), data),
  delete: (id) => apiClient.delete(API.fileById(id)),
  getStats: () => apiClient.get(API.fileStats),
};

// Mail Service
export const mailService = {
  analyze: (data) => apiClient.post(API.mailAnalyze, data),
  generateResponse: (data) => apiClient.post(API.mailResponse, data),
  createThread: (data) => apiClient.post(API.mailThreads, data),
  getThreads: () => apiClient.get(API.mailThreads),
  updateThread: (id, data) => apiClient.put(API.mailThreadById(id), data),
  getHealth: () => apiClient.get(API.mailHealth),
};

// Queue Service
export const queueService = {
  createTask: (data) => apiClient.post(API.queueTasks, data),
  getTask: (id) => apiClient.get(API.queueTaskById(id)),
  retryTask: (id) => apiClient.post(API.queueRetry(id)),
  deleteTask: (id) => apiClient.delete(API.queueTaskById(id)),
  getStats: () => apiClient.get(API.queueStats),
  getJobs: () => apiClient.get(API.queueJobs),
  pause: () => apiClient.patch(API.queuePause),
  resume: () => apiClient.patch(API.queueResume),
  clean: () => apiClient.delete(API.queueClean),
  getHealth: () => apiClient.get(API.queueHealth),
};

// System Service
export const systemService = {
  getHealth: () => apiClient.get(API.health),
};

// Export all services
export default {
  agent: agentService,
  file: fileService,
  mail: mailService,
  queue: queueService,
  system: systemService,
};
