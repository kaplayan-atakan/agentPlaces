import React from 'react';
import '../../styles/enterprise/TargetMarkets.css';

const TargetMarkets = () => {
  const markets = [
    {
      title: 'Financial Services',
      icon: 'university',
      problem: 'Ensuring KVKK/GDPR compliance with customer data',
      solution: 'On-premise agent processing, encrypted data handling',
      marketSize: '$50M+ (Turkey financial tech market)'
    },
    {
      title: 'Healthcare',
      icon: 'hospital',
      problem: 'Patient data security and medical compliance',
      solution: 'HIPAA-compliant agent processing, local medical AI',
      marketSize: '$30M+ (Healthcare IT Turkey)'
    },
    {
      title: 'Legal & Consulting',
      icon: 'balance-scale',
      problem: 'Client confidentiality, document privacy',
      solution: 'Attorney-client privilege protected AI processing',
      marketSize: '$20M+ (Legal tech Turkey)'
    },
    {
      title: 'Defense & Security',
      icon: 'shield-alt',
      problem: 'Classified information processing',
      solution: 'Air-gapped AI systems, no internet dependency',
      marketSize: '$100M+ (Defense tech Turkey)'
    }
  ];

  return (
    <section className="target-markets">
      <div className="section-header">
        <h2>Enterprise Solutions for High-Security Industries</h2>
        <p>Tailored AI agent platforms for industries where data security is non-negotiable</p>
      </div>
      
      <div className="markets-grid">
        {markets.map((market, index) => (
          <div className="market-card" key={index}>
            <div className="market-icon">
              <i className={`fas fa-${market.icon}`}></i>
            </div>
            <h3>{market.title}</h3>
            <div className="market-details">
              <div className="detail-item">
                <h4>Problem:</h4>
                <p>{market.problem}</p>
              </div>
              <div className="detail-item">
                <h4>Solution:</h4>
                <p>{market.solution}</p>
              </div>
              <div className="detail-item">
                <h4>Market Size:</h4>
                <p>{market.marketSize}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TargetMarkets;
