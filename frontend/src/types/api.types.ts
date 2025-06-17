/**
 * AgentPlaces Frontend - API Response Types
 * Backend API'si ile iletişim için tip tanımları
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  metadata?: {
    timestamp: string;
    requestId: string;
    pagination?: PaginationMetadata;
  };
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: string;
  path: string;
}

// File Upload Types
export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

// Mail Analysis Types
export interface EmailThread {
  id: string;
  subject: string;
  participants: string[];
  messageCount: number;
  createdAt: string;
  lastMessageAt: string;
  status: 'unprocessed' | 'processing' | 'analyzed' | 'error';
  analysis?: EmailAnalysis;
}

export interface EmailAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  keyTopics: string[];
  actionItems: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  suggestedResponse?: string;
}

// Queue and Task Types
export interface TaskInfo {
  id: string;
  name: string;
  data: any;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  progress: number;
  createdAt: string;
  processedAt?: string;
  finishedAt?: string;
  error?: string;
  result?: any;
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}
