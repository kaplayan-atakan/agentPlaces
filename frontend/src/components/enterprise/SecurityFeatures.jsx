import React from 'react';
import '../../styles/enterprise/SecurityFeatures.css';

const SecurityFeatures = () => {
  const features = [
    {
      title: 'On-Premise Deployment',
      description: 'Your data never leaves your secure environment. All AI processing happens within your controlled infrastructure.',
      icon: 'server'
    },
    {
      title: 'End-to-End Encryption',
      description: 'FIPS 140-2 Level 3 encryption for all data at rest and in transit within your network.',
      icon: 'lock'
    },
    {
      title: 'Air-Gapped Option',
      description: 'Complete isolation from external networks for maximum security in sensitive environments.',
      icon: 'shield-alt'
    },
    {
      title: 'Audit Logging',
      description: 'Comprehensive audit trails for all AI agent activities to maintain compliance and security.',
      icon: 'clipboard-list'
    },
    {
      title: 'Role-Based Access',
      description: 'Granular control over who can access which agents and what actions they can perform.',
      icon: 'users-cog'
    },
    {
      title: 'Compliance Built-In',
      description: 'KVKK, GDPR, HIPAA, and industry-specific compliance frameworks integrated by design.',
      icon: 'check-circle'
    }
  ];

  return (
    <section className="security-features">
      <div className="section-header">
        <h2>Security-First Architecture</h2>
        <p>Built from the ground up with data protection as the core principle</p>
      </div>
      
      <div className="security-architecture">
        <img src="/images/security-diagram.png" alt="AgentPlaces Security Architecture" />
      </div>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">
              <i className={`fas fa-${feature.icon}`}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="security-cta">
        <h3>Ready to see our security architecture in action?</h3>
        <button className="primary-btn">Schedule Security Review</button>
      </div>
    </section>
  );
};

export default SecurityFeatures;
