/**
 * AgentPlaces Frontend - Agent Type Definitions
 * Ölçeklenebilir ve tip güvenli agent yönetimi için TypeScript türleri
 */

export interface Agent {
  _id: string;
  name: string;
  description: string;
  promptTemplate: string;
  llmProvider: 'openai' | 'local' | 'groq';
  capabilities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: AgentMetadata;
}

export interface AgentMetadata {
  version?: string;
  author?: string;
  category?: string;
  tags?: string[];
  performance?: PerformanceMetrics;
}

export interface PerformanceMetrics {
  totalExecutions: number;
  successRate: number;
  averageResponseTime: number;
  lastExecuted?: string;
}

export interface CreateAgentDto {
  name: string;
  description: string;
  promptTemplate: string;
  llmProvider: 'openai' | 'local' | 'groq';
  capabilities: string[];
  isActive?: boolean;
  metadata?: Partial<AgentMetadata>;
}

export interface UpdateAgentDto extends Partial<CreateAgentDto> {
  _id: string;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  input: any;
  output: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  error?: string;
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  inputSchema: any;
  outputSchema: any;
}

// UI State Types
export interface AgentFilters {
  search?: string;
  llmProvider?: 'all' | 'openai' | 'local' | 'groq';
  isActive?: boolean;
  capabilities?: string[];
  sortBy?: 'name' | 'createdAt' | 'lastExecuted';
  sortOrder?: 'asc' | 'desc';
}

export interface AgentListState {
  agents: Agent[];
  filteredAgents: Agent[];
  filters: AgentFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
