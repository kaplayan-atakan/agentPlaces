/**
 * AgentPlaces - Homepage Component
 * Modern corporate design inspired by Framer, Notion, and Atlassian
 */

import React from 'react';
import './Homepage.css';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient }) => (
  <div className="feature-card" style={{ '--card-gradient': gradient } as React.CSSProperties}>
    <div className="feature-icon">
      <span>{icon}</span>
    </div>
    <div className="feature-content">
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
    <div className="feature-arrow">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8L13 8M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

interface StatItemProps {
  value: string;
  label: string;
  trend?: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, trend }) => (
  <div className="stat-item">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    {trend && <div className="stat-trend">{trend}</div>}
  </div>
);

export const Homepage: React.FC = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI Agent Management',
      description: 'Create, configure, and deploy intelligent agents with advanced capabilities',
      gradient: 'linear-gradient(135deg, #D6232C 0%, #E04851 100%)'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Real-time insights and performance metrics for your AI workflows',
      gradient: 'linear-gradient(135deg, #88B04B 0%, #9BC062 100%)'
    },
    {
      icon: '🔄',
      title: 'Process Automation',
      description: 'Streamline your workflows with intelligent automation and queue management',
      gradient: 'linear-gradient(135deg, #B28B67 0%, #C4A084 100%)'
    },
    {
      icon: '📁',
      title: 'Smart File Processing',
      description: 'Upload, analyze, and process documents with AI-powered insights',
      gradient: 'linear-gradient(135deg, #D6232C 0%, #88B04B 100%)'
    }
  ];

  const stats = [
    { value: '500+', label: 'Active Agents', trend: '+12%' },
    { value: '1.2M', label: 'Documents Processed', trend: '+24%' },
    { value: '99.9%', label: 'Uptime', trend: 'Stable' },
    { value: '< 200ms', label: 'Response Time', trend: 'Optimized' }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span className="badge-text">Next-Generation AI Platform</span>
          </div>
          
          <h1 className="hero-title">
            Build powerful AI agents
            <span className="hero-title-highlight"> that work for you</span>
          </h1>
          
          <p className="hero-description">
            AgentPlaces empowers organizations to create, deploy, and manage intelligent AI agents 
            that automate complex workflows, process documents, and deliver actionable insights.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg">
              <span>Get Started</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8L13 8M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn btn-outline btn-lg">
              <span>Watch Demo</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5 4L11 8L5 12V4Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-header">
              <div className="card-icon">🤖</div>
              <div className="card-title">AI Agent</div>
            </div>
            <div className="card-content">
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <span>Processing...</span>
              </div>
            </div>
          </div>
          
          <div className="floating-card card-2">
            <div className="card-header">
              <div className="card-icon">📊</div>
              <div className="card-title">Analytics</div>
            </div>
            <div className="card-content">
              <div className="mini-chart">
                <div className="chart-bar" style={{ height: '40%' }}></div>
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
                <div className="chart-bar" style={{ height: '45%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="floating-card card-3">
            <div className="card-header">
              <div className="card-icon">✅</div>
              <div className="card-title">Task Complete</div>
            </div>
            <div className="card-content">
              <div className="completion-check">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-header">
            <h2 className="stats-title">Trusted by teams worldwide</h2>
            <p className="stats-description">Join thousands of organizations using AgentPlaces</p>
          </div>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatItem key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">Everything you need to succeed</h2>
          <p className="features-description">
            Powerful features designed to help you build, deploy, and scale AI agents effortlessly
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to get started?</h2>
          <p className="cta-description">
            Join thousands of teams already using AgentPlaces to transform their workflows
          </p>
          <div className="cta-actions">
            <button className="btn btn-primary btn-xl">
              Start Free Trial
            </button>
            <button className="btn btn-outline btn-xl">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
