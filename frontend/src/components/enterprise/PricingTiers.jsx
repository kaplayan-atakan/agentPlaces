import React from 'react';
import '../../styles/enterprise/PricingTiers.css';

const PricingTiers = () => {
  const tiers = [
    {
      name: 'Starter Edition',
      price: '$5,000/year',
      features: [
        '5 concurrent agents',
        '10 user licenses',
        'Basic desktop app',
        'Email support',
        'On-premise deployment'
      ],
      highlight: false
    },
    {
      name: 'Professional Edition',
      price: '$25,000/year',
      features: [
        '25 concurrent agents',
        '50 user licenses',
        'Advanced analytics',
        'Local LLM integration',
        'API access',
        'Phone support',
        'Custom agent templates'
      ],
      highlight: true
    },
    {
      name: 'Enterprise Edition',
      price: '$100,000/year',
      features: [
        'Unlimited agents',
        'Unlimited users',
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager',
        'On-site training',
        '24/7 support',
        'Source code access (escrow)'
      ],
      highlight: false
    },
    {
      name: 'Government/Defense Edition',
      price: '$250,000/year',
      features: [
        'Air-gapped deployment',
        'Security clearance compliance',
        'Government-grade encryption',
        'Audit logging',
        'Custom compliance features',
        'Dedicated security team'
      ],
      highlight: false
    }
  ];

  return (
    <section className="pricing-section">
      <div className="section-header">
        <h2>Enterprise License Tiers</h2>
        <p>Flexible pricing options to match your organization's needs</p>
      </div>
      
      <div className="pricing-container">
        {tiers.map((tier, index) => (
          <div 
            className={`pricing-card ${tier.highlight ? 'highlight' : ''}`} 
            key={index}
          >
            <h3>{tier.name}</h3>
            <div className="price">{tier.price}</div>
            <ul className="features-list">
              {tier.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button className={tier.highlight ? 'primary-btn' : 'secondary-btn'}>
              Get Started
            </button>
          </div>
        ))}
      </div>
      
      <div className="pricing-note">
        <p>All plans include KVKK/GDPR compliance and on-premise deployment options</p>
        <p>Contact us for custom pricing and features</p>
      </div>
    </section>
  );
};

export default PricingTiers;
