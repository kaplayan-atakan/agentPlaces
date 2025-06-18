import React, { useState } from 'react';
import '../../styles/enterprise/ROICalculator.css';

const ROICalculator = () => {
  const [companySize, setCompanySize] = useState(500);
  const [processingTime, setProcessingTime] = useState(40);
  const [costPerHour, setCostPerHour] = useState(50);
  
  const calculateROI = () => {
    const timeSaving = processingTime * 0.4; // 40% improvement
    const annualSaving = timeSaving * costPerHour * 250; // working days
    let agentPlacesCost;
    
    if (companySize < 200) {
      agentPlacesCost = 5000;
    } else if (companySize < 1000) {
      agentPlacesCost = 25000;
    } else {
      agentPlacesCost = 100000;
    }
    
    const roi = (annualSaving - agentPlacesCost) / agentPlacesCost * 100;
    const paybackPeriod = agentPlacesCost / (annualSaving / 12);
    
    return {
      annualSaving: annualSaving.toLocaleString(),
      cost: agentPlacesCost.toLocaleString(),
      roi: roi.toFixed(0),
      paybackPeriod: paybackPeriod.toFixed(1)
    };
  };
  
  const result = calculateROI();

  return (
    <section className="roi-calculator">
      <div className="section-header">
        <h2>ROI Calculator</h2>
        <p>See how quickly AgentPlaces Enterprise can pay for itself</p>
      </div>
      
      <div className="calculator-container">
        <div className="calculator-inputs">
          <div className="input-group">
            <label>Company Size (employees)</label>
            <input 
              type="range" 
              min="50" 
              max="5000" 
              value={companySize} 
              onChange={(e) => setCompanySize(Number(e.target.value))}
            />
            <span>{companySize}</span>
          </div>
          
          <div className="input-group">
            <label>Weekly Processing Hours</label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={processingTime} 
              onChange={(e) => setProcessingTime(Number(e.target.value))}
            />
            <span>{processingTime} hours</span>
          </div>
          
          <div className="input-group">
            <label>Average Cost per Hour (USD)</label>
            <input 
              type="range" 
              min="20" 
              max="200" 
              value={costPerHour} 
              onChange={(e) => setCostPerHour(Number(e.target.value))}
            />
            <span>${costPerHour}</span>
          </div>
        </div>
        
        <div className="calculator-results">
          <div className="result-item">
            <h4>Annual Savings</h4>
            <p className="result-value">${result.annualSaving}</p>
          </div>
          
          <div className="result-item">
            <h4>AgentPlaces Cost</h4>
            <p className="result-value">${result.cost}/year</p>
          </div>
          
          <div className="result-item highlight">
            <h4>ROI</h4>
            <p className="result-value">{result.roi}%</p>
          </div>
          
          <div className="result-item">
            <h4>Payback Period</h4>
            <p className="result-value">{result.paybackPeriod} months</p>
          </div>
        </div>
      </div>
      
      <div className="roi-cta">
        <p>Want a detailed ROI analysis for your specific business case?</p>
        <button className="secondary-btn">Request Custom ROI Report</button>
      </div>
    </section>
  );
};

export default ROICalculator;
