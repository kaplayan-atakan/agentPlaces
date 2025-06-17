/**
 * AgentPlaces Frontend - Agent Form Component
 * Agent oluşturma ve düzenleme formu
 * Doğrulama ve kullanıcı deneyimi odaklı tasarım
 */

import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { Agent, CreateAgentDto, UpdateAgentDto } from '../../types/agent.types';
import { X, Plus, Trash2, Bot, Save, AlertCircle } from 'lucide-react';

interface AgentFormProps {
  agent?: Agent; // undefined ise yeni agent, mevcut ise düzenleme
  onSubmit: (data: CreateAgentDto | UpdateAgentDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  name: string;
  description: string;
  promptTemplate: string;
  llmProvider: 'openai' | 'local' | 'groq';
  capabilities: string[];
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  promptTemplate?: string;
  capabilities?: string;
}

export const AgentForm: FC<AgentFormProps> = ({
  agent,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    promptTemplate: '',
    llmProvider: 'local',
    capabilities: [],
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [newCapability, setNewCapability] = useState('');

  // Düzenleme modunda mevcut agent verilerini yükle
  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        description: agent.description,
        promptTemplate: agent.promptTemplate,
        llmProvider: agent.llmProvider,
        capabilities: [...agent.capabilities],
        isActive: agent.isActive,
      });
    }
  }, [agent]);

  // Form doğrulama
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Agent adı gereklidir';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Agent adı en az 3 karakter olmalıdır';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Açıklama en az 10 karakter olmalıdır';
    }

    if (!formData.promptTemplate.trim()) {
      newErrors.promptTemplate = 'Prompt şablonu gereklidir';
    } else if (formData.promptTemplate.length < 20) {
      newErrors.promptTemplate = 'Prompt şablonu en az 20 karakter olmalıdır';
    }

    if (formData.capabilities.length === 0) {
      newErrors.capabilities = 'En az bir yetenek eklemelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (agent) {
        // Düzenleme modu
        await onSubmit({
          _id: agent._id,
          ...formData,
        } as UpdateAgentDto);
      } else {
        // Yeni agent oluşturma
        await onSubmit(formData as CreateAgentDto);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Yetenek ekleme
  const addCapability = () => {
    if (newCapability.trim() && !formData.capabilities.includes(newCapability.trim())) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, newCapability.trim()],
      }));
      setNewCapability('');
      
      // Capabilities hatası varsa temizle
      if (errors.capabilities) {
        setErrors(prev => ({ ...prev, capabilities: undefined }));
      }
    }
  };

  // Yetenek kaldırma
  const removeCapability = (index: number) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== index),
    }));
  };

  // Input değişimi
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Hata varsa temizle
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {agent ? 'Agent Düzenle' : 'Yeni Agent Oluştur'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-6">
            {/* Agent Adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Adı *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Örn: Mail Analiz Agenti"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Agent'ın ne yaptığını açıklayın..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* LLM Sağlayıcı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LLM Sağlayıcı *
              </label>
              <select
                value={formData.llmProvider}
                onChange={(e) => handleInputChange('llmProvider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="local">Yerel Model</option>
                <option value="openai">OpenAI</option>
                <option value="groq">Groq</option>
              </select>
            </div>

            {/* Prompt Şablonu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt Şablonu *
              </label>
              <textarea
                value={formData.promptTemplate}
                onChange={(e) => handleInputChange('promptTemplate', e.target.value)}
                rows={5}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                  errors.promptTemplate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Sen bir {rol} agentısın. Görevin: {görev}..."
              />
              {errors.promptTemplate && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.promptTemplate}
                </p>
              )}
            </div>

            {/* Yetenekler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yetenekler *
              </label>
              
              {/* Mevcut Yetenekler */}
              {formData.capabilities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {capability}
                      <button
                        type="button"
                        onClick={() => removeCapability(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Yeni Yetenek Ekleme */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Yeni yetenek ekle..."
                />
                <button
                  type="button"
                  onClick={addCapability}
                  disabled={!newCapability.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {errors.capabilities && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.capabilities}
                </p>
              )}
            </div>

            {/* Agent Durumu */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Agent'ı aktif olarak başlat
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {agent ? 'Güncelleniyor...' : 'Oluşturuluyor...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {agent ? 'Güncelle' : 'Oluştur'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
