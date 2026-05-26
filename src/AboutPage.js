import React from 'react';
import './AboutPage.css';
import Header from './Header';
import Footer from './Footer';

function AboutPage() {
  return (
    <div className="about-page">
      <Header />

      <div className="about-main-container">
        <h1 className="about-main-title">About Us</h1>
        <div className="about-content">
          <p className="about-text">
            <strong>Trailer Safe USA</strong> is more than a company—<strong>it's a family</strong>. Built by siblings, aunts, uncles, and cousins, our team is united by trust, craftsmanship, and shared values. That spirit drives our mission: delivering dependable transport solutions for heavy equipment operators who move machinery multiple times a day. From excavators to loaders, we understand the urgency and precision your work demands. <strong>Proudly Made in the USA</strong>, our products are engineered for durability, safety, and ease of use—because your time is valuable and your cargo is critical.
          </p>
          <p className="about-text">
            <strong>Safe. Durable. Made in the USA</strong>—for the equipment that keeps you moving.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutPage;
