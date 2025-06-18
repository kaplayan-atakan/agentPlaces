import React from 'react';
import '../../styles/enterprise/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>AgentPlaces Enterprise</h1>
        <h2>AI Agent Platform for Secure Enterprises</h2>
        <p className="hero-subtitle">
          On-premise AI agent processing with zero data leakage guarantee for 
          organizations where security and compliance matter most
        </p>
        <div className="hero-cta">
          <button className="primary-btn">Request Demo</button>
          <button className="secondary-btn">View Security Whitepaper</button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <h3>40%</h3>
            <p>Document Processing Time Reduction</p>
          </div>
          <div className="stat-item">
            <h3>60%</h3>
            <p>Compliance Audit Preparation Time Saving</p>
          </div>
          <div className="stat-item">
            <h3>$500K</h3>
            <p>Average Annual Cost Savings</p>
          </div>
        </div>
      </div>
      <div className="hero-image">
        <img src="/images/enterprise-dashboard.png" alt="AgentPlaces Enterprise Dashboard" />
      </div>
    </section>
  );
};

export default HeroSection;
