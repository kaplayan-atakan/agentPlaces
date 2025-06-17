/**
 * AgentPlaces Frontend - API Service Layer
 * Backend ile iletişim için merkezi servis katmanı
 * Ölçeklenebilir ve tip güvenli API yönetimi
 */

import axios from 'axios';
import { Agent, CreateAgentDto, UpdateAgentDto } from '../types/agent.types';
import { ApiError, TaskInfo, QueueStats } from '../types/api.types';

class ApiService {
  private api: any;
  private baseURL: string;
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    
    this.api = axios.create({
      baseURL: `${this.baseURL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - token ekleme, logging
    this.api.interceptors.request.use(
      (config: any) => {
        // Token varsa header'a ekle
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error: any) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - hata yönetimi, logging
    this.api.interceptors.response.use(
      (response: any) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: any) => {
        console.error('❌ Response Error:', error);
        
        if (error.response?.status === 401) {
          // Token süresi dolmuş, logout
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        
        return Promise.reject(this.transformError(error));
      }
    );
  }

  private transformError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data.message || 'Bir hata oluştu',
        code: error.response.data.code || 'API_ERROR',
        details: error.response.data.details,
        timestamp: new Date().toISOString(),
        path: error.config?.url || '',
      };
    }
    
    return {
      message: error.message || 'Bağlantı hatası',
      code: 'NETWORK_ERROR',
      timestamp: new Date().toISOString(),
      path: error.config?.url || '',
    };
  }

  // Agent Management API Methods
  async getAgents(): Promise<Agent[]> {
    const response = await this.api.get('/api/agents');
    return response.data;
  }

  async getAgent(id: string): Promise<Agent> {
    const response = await this.api.get(`/api/agents/${id}`);
    return response.data;
  }

  async createAgent(agentData: CreateAgentDto): Promise<Agent> {
    const response = await this.api.post('/api/agents', agentData);
    return response.data;
  }

  async updateAgent(id: string, agentData: UpdateAgentDto): Promise<Agent> {
    const response = await this.api.patch(`/api/agents/${id}`, agentData);
    return response.data;
  }

  async deleteAgent(id: string): Promise<void> {
    await this.api.delete(`/api/agents/${id}`);
  }

  async toggleAgentStatus(id: string): Promise<Agent> {
    const response = await this.api.patch(`/api/agents/${id}/toggle`);
    return response.data;
  }

  // Agent Execution API Methods
  async executeAgent(id: string, input: any): Promise<any> {
    const response = await this.api.post(`/api/agents/${id}/execute`, { input });
    return response.data;
  }

  // File Management API Methods
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async getFile(fileId: string): Promise<Blob> {
    const response = await this.api.get(`/api/files/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.api.delete(`/api/files/${fileId}`);
  }

  // Queue Management API Methods
  async getQueueStats(): Promise<QueueStats> {
    const response = await this.api.get('/api/queue/stats');
    return response.data;
  }

  async getTasks(status?: string): Promise<TaskInfo[]> {
    const params = status ? { status } : {};
    const response = await this.api.get('/api/queue/tasks', { params });
    return response.data;
  }

  async retryTask(taskId: string): Promise<void> {
    await this.api.post(`/api/queue/tasks/${taskId}/retry`);
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; uptime: number }> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

// Singleton instance
export const apiService = new ApiService();
export default apiService;
