const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2809';

export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;

export const API = {
  // Base API URL
  base: API_URL,
  
  // Agent endpoints
  agents: getApiUrl('/api/agents'),
  agentById: (id) => getApiUrl(`/api/agents/${id}`),
  agentsByType: (type) => getApiUrl(`/api/agents/type/${type}`),
  agentUsage: (id) => getApiUrl(`/api/agents/${id}/usage`),
  
  // File processing endpoints
  files: getApiUrl('/api/files'),
  fileUpload: getApiUrl('/api/files/upload'),
  fileById: (id) => getApiUrl(`/api/files/${id}`),
  fileProcess: (id) => getApiUrl(`/api/files/${id}/process`),
  fileAnalysis: (id) => getApiUrl(`/api/files/${id}/analysis`),
  fileStats: getApiUrl('/api/files/stats/summary'),
  
  // Mail analysis endpoints
  mail: getApiUrl('/api/mail'),
  mailAnalyze: getApiUrl('/api/mail/analyze'),
  mailResponse: getApiUrl('/api/mail/generate-response'),
  mailThreads: getApiUrl('/api/mail/threads'),
  mailThreadById: (id) => getApiUrl(`/api/mail/threads/${id}`),
  mailHealth: getApiUrl('/api/mail/health'),
  
  // Queue management endpoints
  queue: getApiUrl('/api/queue'),
  queueTasks: getApiUrl('/api/queue/tasks'),
  queueTaskById: (id) => getApiUrl(`/api/queue/tasks/${id}`),
  queueRetry: (id) => getApiUrl(`/api/queue/tasks/${id}/retry`),
  queueStats: getApiUrl('/api/queue/stats'),
  queueJobs: getApiUrl('/api/queue/jobs'),
  queuePause: getApiUrl('/api/queue/pause'),
  queueResume: getApiUrl('/api/queue/resume'),
  queueClean: getApiUrl('/api/queue/clean'),
  queueHealth: getApiUrl('/api/queue/health'),
  
  // System endpoints
  health: getApiUrl('/api/health'),
};
