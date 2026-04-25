/**
 * Turkish Welcome Component
 * Displays a warm Turkish greeting and project overview
 */

import React from 'react';
import { useTurkish } from '../hooks/useTurkish';
import './TurkishWelcome.css';

interface TurkishWelcomeProps {
  onClose?: () => void;
  showFullInfo?: boolean;
}

export const TurkishWelcome: React.FC<TurkishWelcomeProps> = ({ 
  onClose, 
  showFullInfo = true 
}) => {
  const { tr, getStatusText } = useTurkish();

  return (
    <div className="turkish-welcome">
      <div className="welcome-header">
        <div className="greeting-section">
          <h1 className="greeting-title">
            🇹🇷 Merhaba! 
            <span className="wave">👋</span>
          </h1>
          <p className="greeting-subtitle">
            AgentPlaces'e hoş geldiniz!
          </p>
        </div>
        
        {onClose && (
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="welcome-content">
        <div className="project-intro">
          <h2>🚀 {tr.homepage.subtitle}</h2>
          <p className="intro-text">
            {tr.homepage.description}
          </p>
        </div>

        {showFullInfo && (
          <>
            <div className="feature-highlights">
              <h3>✨ Öne Çıkan Özellikler</h3>
              <div className="feature-grid">
                <div className="feature-item">
                  <span className="feature-icon">🤖</span>
                  <div>
                    <h4>{tr.homepage.features.agentManagement.title}</h4>
                    <p>{tr.homepage.features.agentManagement.description}</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <div>
                    <h4>{tr.homepage.features.analytics.title}</h4>
                    <p>{tr.homepage.features.analytics.description}</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <span className="feature-icon">🔄</span>
                  <div>
                    <h4>{tr.homepage.features.automation.title}</h4>
                    <p>{tr.homepage.features.automation.description}</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <span className="feature-icon">📁</span>
                  <div>
                    <h4>{tr.homepage.features.fileProcessing.title}</h4>
                    <p>{tr.homepage.features.fileProcessing.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="quick-start">
              <h3>🎯 Hızlı Başlangıç</h3>
              <div className="quick-start-steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <div>
                    <h4>Servisleri Kontrol Edin</h4>
                    <p>Backend ve veritabanı bağlantılarının aktif olduğundan emin olun</p>
                  </div>
                </div>
                
                <div className="step">
                  <span className="step-number">2</span>
                  <div>
                    <h4>İlk Agent'ınızı Oluşturun</h4>
                    <p>Mail analiz veya dosya işleme agent'ı ile başlayabilirsiniz</p>
                  </div>
                </div>
                
                <div className="step">
                  <span className="step-number">3</span>
                  <div>
                    <h4>Dosya Yükleyin ve Test Edin</h4>
                    <p>PDF, Word veya e-posta dosyalarını yükleyerek sistemi test edin</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="helpful-links">
              <h3>📚 Yararlı Kaynaklar</h3>
              <div className="links-grid">
                <a href="#documentation" className="link-item">
                  <span>📖</span>
                  <div>
                    <h4>Dokümantasyon</h4>
                    <p>Detaylı kullanım kılavuzları</p>
                  </div>
                </a>
                
                <a href="#api-docs" className="link-item">
                  <span>🔧</span>
                  <div>
                    <h4>API Rehberi</h4>
                    <p>Backend API endpoint'leri</p>
                  </div>
                </a>
                
                <a href="#examples" className="link-item">
                  <span>🧪</span>
                  <div>
                    <h4>Test Örnekleri</h4>
                    <p>Hazır test dosyaları</p>
                  </div>
                </a>
                
                <a href="#support" className="link-item">
                  <span>💬</span>
                  <div>
                    <h4>Destek</h4>
                    <p>Yardım ve sorun çözme</p>
                  </div>
                </a>
              </div>
            </div>
          </>
        )}

        <div className="action-buttons">
          <button className="primary-button">
            {tr.homepage.getStarted}
          </button>
          <button className="secondary-button">
            {tr.homepage.learnMore}
          </button>
        </div>
      </div>

      <div className="welcome-footer">
        <p className="footer-text">
          🎉 AgentPlaces ile ölçeklenebilir agent geliştirmeye başlayın!
        </p>
        <p className="footer-note">
          Bu platform Türkiye'deki geliştiriciler için özel olarak optimize edilmiştir.
        </p>
      </div>
    </div>
  );
};

export default TurkishWelcome;