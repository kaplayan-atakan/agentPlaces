/**
 * AgentPlaces Frontend - Main Application Component
 * Modern UI/UX with corporate design system
 */

import { useState } from 'react';
import { AgentList } from './components/agent-manager/AgentList';
import { FileManager } from './components/file-upload/FileManager';
import { Homepage } from './components/Homepage';
import { useApiHealth } from './hooks/useAgents';
import './styles/design-system.css';
import './styles/components.css';
import './App.css';

function App() {
  const { isHealthy, lastCheck } = useApiHealth();
  const [activeTab, setActiveTab] = useState('home');

  const getStatusIcon = () => {
    if (isHealthy === null) return '⏳';
    return isHealthy ? '✅' : '❌';
  };

  const getStatusText = () => {
    if (isHealthy === null) return 'Kontrol ediliyor...';
    return isHealthy ? 'Sistem Aktif' : 'Bağlantı Hatası';
  };

  const getStatusClass = () => {
    if (isHealthy === null) return 'status-checking';
    return isHealthy ? 'status-healthy' : 'status-error';
  };

  // Don't show header and navigation for homepage
  if (activeTab === 'home') {
    return (
      <div className="app">
        <Homepage />
        {/* Floating navigation for homepage */}
        <div className="floating-nav">
          <button
            onClick={() => setActiveTab('agents')}
            className="floating-nav-btn"
            title="Go to Agent Management"
          >
            🤖 Agents
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className="floating-nav-btn"
            title="Go to File Management"
          >
            📁 Files
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Modern Header with Status */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            {/* Logo & Brand */}
            <div className="brand">
              <div 
                className="brand-icon"
                onClick={() => setActiveTab('home')}
                style={{ cursor: 'pointer' }}
                title="Go to Homepage"
              >
                🤖
              </div>
              <div className="brand-text">
                <h1 
                  className="brand-title"
                  onClick={() => setActiveTab('home')}
                  style={{ cursor: 'pointer' }}
                  title="Go to Homepage"
                >
                  AgentPlaces
                </h1>
                <p className="brand-subtitle">AI-Powered Platform</p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className={`status-indicator ${getStatusClass()}`}>
              <div className="status-content">
                <span className="status-icon">{getStatusIcon()}</span>
                <div className="status-details">
                  <span className="status-text">{getStatusText()}</span>
                  {lastCheck && (
                    <small className="status-time">
                      Son güncelleme: {lastCheck.toLocaleTimeString('tr-TR')}
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="navigation">
        <div className="container">
          <div className="nav-tabs">
            <button
              onClick={() => setActiveTab('home')}
              className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            >
              <span className="nav-tab-icon">🏠</span>
              <span className="nav-tab-text">Ana Sayfa</span>
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`nav-tab ${activeTab === 'agents' ? 'active' : ''}`}
            >
              <span className="nav-tab-icon">🤖</span>
              <span className="nav-tab-text">Agent Yönetimi</span>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`nav-tab ${activeTab === 'files' ? 'active' : ''}`}
            >
              <span className="nav-tab-icon">📁</span>
              <span className="nav-tab-text">Dosya Yönetimi</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="content-area">
            {activeTab === 'agents' && (
              <section className="content-section">
                <div className="section-header">
                  <h2 className="section-title">Agent Yönetimi</h2>
                  <p className="section-description">
                    AI agent'larınızı oluşturun, yapılandırın ve yönetin
                  </p>
                </div>
                <AgentList />
              </section>
            )}
            
            {activeTab === 'files' && (
              <section className="content-section">
                <div className="section-header">
                  <h2 className="section-title">Dosya Yönetimi</h2>
                  <p className="section-description">
                    Dosyalarınızı yükleyin, işleyin ve analiz edin
                  </p>
                </div>
                <FileManager />
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
