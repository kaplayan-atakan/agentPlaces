/**
 * AgentPlaces Frontend - Main Application Component
 * Ölçeklenebilir agent yönetim platformu ana bileşeni
 */

import { useState } from 'react';
import { AgentList } from './components/agent-manager/AgentList';
import { FileManager } from './components/file-upload/FileManager';
import { useApiHealth } from './hooks/useAgents';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './App.css';

function App() {
  const { isHealthy, lastCheck } = useApiHealth();
  const [activeTab, setActiveTab] = useState<'agents' | 'files'>('agents');

  return (
    <div className="App">
      {/* Health Status Bar */}
      <div className={`fixed top-0 left-0 right-0 z-40 px-4 py-2 text-sm ${
        isHealthy === null 
          ? 'bg-gray-100 text-gray-700' 
          : isHealthy 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isHealthy === null ? (
              <Clock className="w-4 h-4" />
            ) : isHealthy ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>
              API Durumu: {
                isHealthy === null 
                  ? 'Kontrol ediliyor...' 
                  : isHealthy 
                    ? 'Bağlı' 
                    : 'Bağlantı Hatası'
              }
            </span>
          </div>
          {lastCheck && (
            <span className="text-xs opacity-75">
              Son kontrol: {lastCheck.toLocaleTimeString('tr-TR')}
            </span>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="pt-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('agents')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'agents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🤖 Agent Yönetimi
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'files'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📁 Dosya Yönetimi
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'agents' && <AgentList />}
          {activeTab === 'files' && <FileManager />}
        </div>
      </div>
    </div>
  );
}

export default App;
