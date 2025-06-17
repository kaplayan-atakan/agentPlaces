export interface FileUploadResponse {
  success: boolean;
  data: {
    fileId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
    url?: string;
  };
  message: string;
}

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  url?: string;
  analysis?: {
    textContent?: string;
    metadata?: any;
    extractedAt?: string;
  };
}

export interface QueueTask {
  taskId: string;
  name: string;
  type: 'file_processing' | 'mail_analysis' | 'response_generation';
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  priority: number;
  created: string;
  processed?: string;
  finished?: string;
  progress?: number;
  data?: any;
  error?: string;
}

export interface CreateTaskRequest {
  name: string;
  type: 'file_processing' | 'mail_analysis' | 'response_generation';
  data: any;
  priority?: 1 | 2 | 3 | 4;
  delay?: number;
  options?: {
    removeOnComplete?: number;
    removeOnFail?: number;
  };
}
