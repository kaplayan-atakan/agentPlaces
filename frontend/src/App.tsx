/**
 * AgentPlaces Frontend - Main Application Component
 * Ölçeklenebilir agent yönetim platformu ana bileşeni
 */

import { AgentList } from './components/agent-manager/AgentList';
import { useApiHealth } from './hooks/useAgents';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './App.css';

function App() {
  const { isHealthy, lastCheck } = useApiHealth();

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

      {/* Main Content */}
      <div className="pt-10">
        <AgentList />
      </div>
    </div>
  );
}

export default App;
