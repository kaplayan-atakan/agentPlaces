/**
 * AgentPlaces Frontend - Agent Card Component
 * Tekil agent görüntüleme ve yönetim bileşeni
 * Modüler ve yeniden kullanılabilir tasarım
 */

import type { FC } from 'react';
import { Agent } from '../../types/agent.types';
import { 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Bot, 
  Clock, 
  CheckCircle, 
  XCircle,
  Zap
} from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onEdit?: (agent: Agent) => void;
  onDelete?: (agent: Agent) => void;
  onToggleStatus?: (agent: Agent) => void;
  onExecute?: (agent: Agent) => void;
  compact?: boolean;
}

export const AgentCard: FC<AgentCardProps> = ({
  agent,
  onEdit,
  onDelete,
  onToggleStatus,
  onExecute,
  compact = false,
}) => {
  const getLLMProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai':
        return '🤖';
      case 'local':
        return '💻';
      case 'groq':
        return '⚡';
      default:
        return '🔧';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai':
        return 'bg-green-100 text-green-800';
      case 'local':
        return 'bg-blue-100 text-blue-800';
      case 'groq':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            agent.isActive ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Bot className={`w-4 h-4 ${agent.isActive ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500 truncate max-w-xs">{agent.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(agent.llmProvider)}`}>
            {getLLMProviderIcon(agent.llmProvider)} {agent.llmProvider}
          </span>
          
          {agent.isActive ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              agent.isActive ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Bot className={`w-6 h-6 ${agent.isActive ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {agent.isActive ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Aktif
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <XCircle className="w-3 h-3 mr-1" />
                Pasif
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* LLM Provider */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">LLM Sağlayıcı:</span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProviderColor(agent.llmProvider)}`}>
            {getLLMProviderIcon(agent.llmProvider)} {agent.llmProvider.toUpperCase()}
          </span>
        </div>

        {/* Capabilities */}
        {agent.capabilities && agent.capabilities.length > 0 && (
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700 block mb-2">Yetenekler:</span>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((capability, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {agent.metadata?.performance && (
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {agent.metadata.performance.totalExecutions}
              </div>
              <div className="text-xs text-gray-600">Toplam Çalıştırma</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                %{Math.round(agent.metadata.performance.successRate * 100)}
              </div>
              <div className="text-xs text-gray-600">Başarı Oranı</div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Oluşturulma: {formatDate(agent.createdAt)}
          </div>
          {agent.metadata?.performance?.lastExecuted && (
            <div className="flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Son Çalıştırma: {formatDate(agent.metadata.performance.lastExecuted)}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {onExecute && agent.isActive && (
              <button
                onClick={() => onExecute(agent)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Play className="w-4 h-4 mr-1" />
                Çalıştır
              </button>
            )}
            
            {onToggleStatus && (
              <button
                onClick={() => onToggleStatus(agent)}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md transition-colors ${
                  agent.isActive
                    ? 'text-orange-700 bg-orange-100 hover:bg-orange-200 focus:ring-orange-500'
                    : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500'
                }`}
              >
                {agent.isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Durdur
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Başlat
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(agent)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Düzenle
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(agent)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Sil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
