import React, { useState } from 'react';
import '../../styles/enterprise/ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    industry: '',
    employeeCount: '',
    message: '',
    interests: []
  });

  const industries = [
    'Financial Services',
    'Healthcare',
    'Legal & Consulting',
    'Defense & Security',
    'Government',
    'Education',
    'Manufacturing',
    'Other'
  ];

  const interestOptions = [
    'Security Features',
    'On-premise Deployment',
    'Pricing Information',
    'Custom Integration',
    'Demo Request',
    'ROI Analysis'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          interests: [...formData.interests, value]
        });
      } else {
        setFormData({
          ...formData,
          interests: formData.interests.filter(interest => interest !== value)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send this data to your backend
    alert('Thank you for your interest! Our enterprise team will contact you shortly.');
  };

  return (
    <section className="contact-section" id="enterprise-contact">
      <div className="section-header">
        <h2>Ready to Transform Your Enterprise?</h2>
        <p>Contact our enterprise team to discuss your specific needs</p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info">
          <h3>Enterprise Sales</h3>
          <p><i className="fas fa-phone"></i> +90 (212) 555-0123</p>
          <p><i className="fas fa-envelope"></i> enterprise@agentplaces.com</p>
          
          <h3>Security Inquiries</h3>
          <p><i className="fas fa-shield-alt"></i> security@agentplaces.com</p>
          
          <div className="enterprise-office">
            <h3>Istanbul Office</h3>
            <p><i className="fas fa-map-marker-alt"></i> Levent, 34330 Istanbul, Turkey</p>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name*</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="company">Company Name*</label>
              <input 
                type="text" 
                id="company" 
                name="company"
                value={formData.company}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">Position/Title*</label>
              <input 
                type="text" 
                id="position" 
                name="position"
                value={formData.position}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Business Email*</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="employeeCount">Number of Employees</label>
              <select 
                id="employeeCount" 
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1-50">1-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1001-5000">1001-5000</option>
                <option value="5000+">5000+</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="industry">Industry*</label>
            <select 
              id="industry" 
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            >
              <option value="">Select Industry</option>
              {industries.map((industry, index) => (
                <option key={index} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>I'm interested in (select all that apply):</label>
            <div className="checkbox-group">
              {interestOptions.map((option, index) => (
                <div className="checkbox-item" key={index}>
                  <input 
                    type="checkbox" 
                    id={`interest-${index}`} 
                    name="interests" 
                    value={option}
                    checked={formData.interests.includes(option)}
                    onChange={handleChange}
                  />
                  <label htmlFor={`interest-${index}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Additional Information</label>
            <textarea 
              id="message" 
              name="message" 
              rows="4"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <button type="submit" className="primary-btn">Request Enterprise Consultation</button>
          
          <p className="form-disclaimer">
            By submitting this form, you agree to our privacy policy and consent to being contacted by our enterprise team.
          </p>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
