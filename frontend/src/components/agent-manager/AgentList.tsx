/**
 * AgentPlaces Frontend - Agent List Component
 * Agent listesi, filtreleme ve sayfalama bileşeni
 * Ölçeklenebilir ve performanslı tasarım
 */

import { useState } from 'react';
import type { FC } from 'react';
import { useAgents } from '../../hooks/useAgents';
import { Agent, AgentFilters } from '../../types/agent.types';
import { AgentCard } from './AgentCard';
import { AgentForm } from './AgentForm';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Grid, 
  List,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Bot
} from 'lucide-react';

export const AgentList: FC = () => {
  const {
    paginatedAgents,
    filters,
    loading,
    error,
    pagination,
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
  } = useAgents();
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formLoading, setFormLoading] = useState(false);

  // Form gönderimi
  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingAgent) {
        await updateAgent(editingAgent._id, data);
      } else {
        await createAgent(data);
      }
      setShowForm(false);
      setEditingAgent(undefined);
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Form iptal
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAgent(undefined);
  };

  // Agent düzenleme
  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowForm(true);
  };

  // Agent silme
  const handleDeleteAgent = async (agent: Agent) => {
    if (window.confirm(`"${agent.name}" adlı agent'ı silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteAgent(agent._id);
      } catch (error) {
        console.error('Agent deletion failed:', error);
      }
    }
  };

  // Agent durum değiştirme
  const handleToggleStatus = async (agent: Agent) => {
    try {
      await toggleAgentStatus(agent._id);
    } catch (error) {
      console.error('Agent status toggle failed:', error);
    }
  };

  // Filtre değişimi
  const handleFilterChange = (newFilters: Partial<AgentFilters>) => {
    applyFilters(newFilters);
  };

  // Sayfa değişimi
  const handlePageChange = (page: number) => {
    changePage(page);
  };

  // Sayfa boyutu değişimi
  const handlePageSizeChange = (size: number) => {
    changePageSize(size);
  };

  // Yenileme
  const handleRefresh = () => {
    loadAgents();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agent Yönetimi</h1>
                <p className="text-sm text-gray-600">
                  {pagination.total} agent • {paginatedAgents.length} görüntülenen
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Yenile"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Kart Görünümü"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Liste Görünümü"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Agent ara..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* LLM Provider Filter */}
            <select
              value={filters.llmProvider || 'all'}
              onChange={(e) => handleFilterChange({ llmProvider: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Sağlayıcılar</option>
              <option value="local">Yerel</option>
              <option value="openai">OpenAI</option>
              <option value="groq">Groq</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange({ 
                  isActive: value === 'all' ? undefined : value === 'active' 
                });
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>

            {/* Sort */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange({ sortBy: sortBy as any, sortOrder: sortOrder as any });
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt-desc">Yeni Oluşturulan</option>
              <option value="createdAt-asc">Eski Oluşturulan</option>
              <option value="name-asc">İsim (A-Z)</option>
              <option value="name-desc">İsim (Z-A)</option>
              <option value="lastExecuted-desc">Son Çalıştırılan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && paginatedAgents.length === 0 ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Agentlar yükleniyor...</p>
          </div>
        ) : paginatedAgents.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.search || filters.llmProvider !== 'all' || filters.isActive !== undefined
                ? 'Filtrelere uygun agent bulunamadı'
                : 'Henüz agent oluşturulmamış'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.llmProvider !== 'all' || filters.isActive !== undefined
                ? 'Farklı filtre kriterleri deneyin'
                : 'İlk agent\'ınızı oluşturarak başlayın'}
            </p>
            {!filters.search && filters.llmProvider === 'all' && filters.isActive === undefined && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                İlk Agent'ı Oluştur
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Agent Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {paginatedAgents.map((agent) => (
                <AgentCard
                  key={agent._id}
                  agent={agent}
                  compact={viewMode === 'list'}
                  onEdit={handleEditAgent}
                  onDelete={handleDeleteAgent}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Sayfa başına:</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-sm text-gray-700">
                    Sayfa {pagination.page} / {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <AgentForm
          agent={editingAgent}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}
    </div>
  );
};
