import React from 'react';
import HeroSection from '../components/enterprise/HeroSection';
import TargetMarkets from '../components/enterprise/TargetMarkets';
import PricingTiers from '../components/enterprise/PricingTiers';
import SecurityFeatures from '../components/enterprise/SecurityFeatures';
import ROICalculator from '../components/enterprise/ROICalculator';
import ContactForm from '../components/enterprise/ContactForm';
import TestimonialsSection from '../components/enterprise/TestimonialsSection';
import '../styles/EnterprisePage.css';

const EnterprisePage = () => {
  return (
    <div className="enterprise-page">
      <HeroSection />
      <TargetMarkets />
      <SecurityFeatures />
      <PricingTiers />
      <ROICalculator />
      <TestimonialsSection />
      <ContactForm />
    </div>
  );
};

export default EnterprisePage;
