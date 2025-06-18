import React from 'react';
import '../../styles/enterprise/TestimonialsSection.css';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "AgentPlaces Enterprise helped us achieve 70% loan processing acceleration while maintaining full KVKK compliance.",
      author: "CTO, Leading Turkish Bank",
      image: "/images/testimonial1.jpg"
    },
    {
      quote: "The air-gapped deployment option gave us confidence to implement AI in our most sensitive operations.",
      author: "Information Security Director, Defense Contractor",
      image: "/images/testimonial2.jpg"
    },
    {
      quote: "Patient data never leaves our premises, yet we get all the benefits of AI-powered assistance with AgentPlaces.",
      author: "CIO, Major Turkish Hospital Network",
      image: "/images/testimonial3.jpg"
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="section-header">
        <h2>Enterprise Success Stories</h2>
        <p>Hear from organizations that have transformed their operations with AgentPlaces</p>
      </div>
      
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <div className="quote-mark">"</div>
            <p className="quote">{testimonial.quote}</p>
            <div className="author-info">
              <img src={testimonial.image} alt={testimonial.author} className="author-image" />
              <p className="author-name">{testimonial.author}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="case-studies-link">
        <p>Want to see detailed implementation case studies?</p>
        <button className="text-btn">View All Case Studies →</button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
