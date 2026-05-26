import React from 'react';
import './FAQPage.css';
import Header from './Header';
import Footer from './Footer';

function FAQPage() {
  return (
    <div className="faq-page">
      <Header />

      <div className="faq-main-container">
        <h1 className="faq-main-title">Frequently Asked Questions</h1>
        <div className="faq-content">
          <div className="faq-item">
            <h3 className="faq-question">What materials are used in your track covers?</h3>
            <p className="faq-answer">Our track covers are made from high-grade, weather-resistant materials designed to withstand harsh outdoor conditions.</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">Do you offer custom sizes?</h3>
            <p className="faq-answer">Yes, we can create custom-sized track covers to fit your specific equipment requirements.</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">How long do the covers last?</h3>
            <p className="faq-answer">With proper care, our track covers can last several years, providing excellent protection for your equipment.</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">What is your return policy?</h3>
            <p className="faq-answer">We offer a 30-day return policy for unused items in original packaging.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FAQPage;
