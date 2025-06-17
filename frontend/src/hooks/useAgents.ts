/**
 * AgentPlaces Frontend - Custom React Hooks
 * Agent yönetimi için özelleştirilmiş hooks
 * State management ve API entegrasyonu
 */

import { useState, useEffect, useCallback } from 'react';
import { Agent, CreateAgentDto, UpdateAgentDto, AgentFilters, AgentListState } from '../types/agent.types';
import { apiService } from '../services/api.service';

/**
 * Agent listesi yönetimi için hook
 * CRUD operasyonları, filtreleme ve pagination destekli
 */
export const useAgents = () => {
  const [state, setState] = useState<AgentListState>({
    agents: [],
    filteredAgents: [],
    filters: {
      search: '',
      llmProvider: 'all',
      isActive: undefined,
      capabilities: [],
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  });

  // Agent listesini yükle
  const loadAgents = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const agents = await apiService.getAgents();
      setState(prev => ({
        ...prev,
        agents,
        filteredAgents: agents,
        loading: false,
        pagination: {
          ...prev.pagination,
          total: agents.length,
          totalPages: Math.ceil(agents.length / prev.pagination.limit),
        },
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Agentlar yüklenirken hata oluştu',
      }));
    }
  }, []);

  // Yeni agent oluştur
  const createAgent = useCallback(async (agentData: CreateAgentDto): Promise<Agent> => {
    const newAgent = await apiService.createAgent(agentData);
    setState(prev => ({
      ...prev,
      agents: [...prev.agents, newAgent],
    }));
    return newAgent;
  }, []);

  // Agent güncelle
  const updateAgent = useCallback(async (id: string, agentData: UpdateAgentDto): Promise<Agent> => {
    const updatedAgent = await apiService.updateAgent(id, agentData);
    setState(prev => ({
      ...prev,
      agents: prev.agents.map(agent => 
        agent._id === id ? updatedAgent : agent
      ),
    }));
    return updatedAgent;
  }, []);

  // Agent sil
  const deleteAgent = useCallback(async (id: string): Promise<void> => {
    await apiService.deleteAgent(id);
    setState(prev => ({
      ...prev,
      agents: prev.agents.filter(agent => agent._id !== id),
    }));
  }, []);

  // Agent durumunu değiştir (aktif/pasif)
  const toggleAgentStatus = useCallback(async (id: string): Promise<Agent> => {
    const updatedAgent = await apiService.toggleAgentStatus(id);
    setState(prev => ({
      ...prev,
      agents: prev.agents.map(agent => 
        agent._id === id ? updatedAgent : agent
      ),
    }));
    return updatedAgent;
  }, []);

  // Filtreleri uygula
  const applyFilters = useCallback((newFilters: Partial<AgentFilters>) => {
    setState(prev => {
      const updatedFilters = { ...prev.filters, ...newFilters };
      let filtered = [...prev.agents];

      // Arama filtresi
      if (updatedFilters.search) {
        filtered = filtered.filter(agent =>
          agent.name.toLowerCase().includes(updatedFilters.search!.toLowerCase()) ||
          agent.description.toLowerCase().includes(updatedFilters.search!.toLowerCase())
        );
      }

      // LLM sağlayıcı filtresi
      if (updatedFilters.llmProvider && updatedFilters.llmProvider !== 'all') {
        filtered = filtered.filter(agent => agent.llmProvider === updatedFilters.llmProvider);
      }

      // Aktiflik filtresi
      if (updatedFilters.isActive !== undefined) {
        filtered = filtered.filter(agent => agent.isActive === updatedFilters.isActive);
      }

      // Yetenekler filtresi
      if (updatedFilters.capabilities && updatedFilters.capabilities.length > 0) {
        filtered = filtered.filter(agent =>
          updatedFilters.capabilities!.some(capability =>
            agent.capabilities.includes(capability)
          )
        );
      }

      // Sıralama
      if (updatedFilters.sortBy) {
        filtered.sort((a, b) => {
          let aValue, bValue;
          
          switch (updatedFilters.sortBy) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
              break;
            case 'lastExecuted':
              aValue = a.metadata?.performance?.lastExecuted ? 
                new Date(a.metadata.performance.lastExecuted).getTime() : 0;
              bValue = b.metadata?.performance?.lastExecuted ? 
                new Date(b.metadata.performance.lastExecuted).getTime() : 0;
              break;
            default:
              return 0;
          }

          if (updatedFilters.sortOrder === 'desc') {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          } else {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          }
        });
      }

      return {
        ...prev,
        filters: updatedFilters,
        filteredAgents: filtered,
        pagination: {
          ...prev.pagination,
          page: 1, // Filtre değiştiğinde ilk sayfaya dön
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / prev.pagination.limit),
        },
      };
    });
  }, []);

  // Sayfa değiştir
  const changePage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page },
    }));
  }, []);

  // Sayfa başına kayıt sayısını değiştir
  const changePageSize = useCallback((limit: number) => {
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        limit,
        page: 1,
        totalPages: Math.ceil(prev.filteredAgents.length / limit),
      },
    }));
  }, []);

  // Sayfalanmış agentları al
  const getPaginatedAgents = useCallback(() => {
    const { page, limit } = state.pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return state.filteredAgents.slice(startIndex, endIndex);
  }, [state.filteredAgents, state.pagination]);
  // İlk yükleme
  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  // Agents değiştiğinde filtreleri yeniden uygula
  useEffect(() => {
    if (state.agents.length > 0) {
      applyFilters({});
    }
  }, [state.agents.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    paginatedAgents: getPaginatedAgents(),
    actions: {
      loadAgents,
      createAgent,
      updateAgent,
      deleteAgent,
      toggleAgentStatus,
      applyFilters,
      changePage,
      changePageSize,
    },
  };
};

/**
 * Dosya yükleme işlemleri için hook
 */
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await apiService.uploadFile(file, setProgress);
      setUploading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Dosya yüklenirken hata oluştu');
      setUploading(false);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
    reset,
  };
};

/**
 * API sağlık durumu kontrolü için hook
 */
export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      await apiService.healthCheck();
      setIsHealthy(true);
      setLastCheck(new Date());
    } catch (error) {
      setIsHealthy(false);
      setLastCheck(new Date());
    }
  }, []);

  useEffect(() => {
    checkHealth();
    
    // Her 30 saniyede bir sağlık kontrolü yap
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    isHealthy,
    lastCheck,
    checkHealth,
  };
};
