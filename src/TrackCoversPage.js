import React from 'react';
import { Link } from 'react-router-dom';
import './TrackCoversPage.css';
import Header from './Header';
import Footer from './Footer';

function TrackCoversPage() {
  return (
    <div className="track-covers-page">
      <Header />

      {/* Hero Section */}
      <section className="track-covers-hero">
        <div className="hero-content">
          <div className="hero-text">
            <Link to="/" className="logo-link">
              <img src="/trackcoverlogo.png" alt="Track Cover Logo" className="track-cover-logo" />
            </Link>
            <h1 className="hero-title">Bigfoot Track Covers</h1>
            <p className="hero-subtitle">Cover Your Tracks</p>
            <p className="hero-description">
              Our premium track covers provide superior protection against weather, debris,
              and wear for all types of heavy machinery and construction equipment.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Get Quote</button>
              <button className="btn-secondary">View Catalog</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/trackcover.png" alt="Track Covers Product" className="product-showcase" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">Why Choose Our Track Covers?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3 className="feature-title">Durable Materials</h3>
              <p className="feature-description">
                Made from high-grade, weather-resistant materials that withstand harsh outdoor conditions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3 className="feature-title">Custom Sizing</h3>
              <p className="feature-description">
                Available in standard sizes or custom-made to fit your specific equipment requirements.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3 className="feature-title">Easy Installation</h3>
              <p className="feature-description">
                Simple, secure fastening system that's quick to install and remove when needed.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Cost Effective</h3>
              <p className="feature-description">
                Protect your investment with covers that extend equipment life and reduce maintenance costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="product-details">
        <div className="details-content">
          <div className="details-text">
            <h2 className="section-title">Product Specifications</h2>
            <div className="specs-list">
              <div className="spec-item">
                <span className="spec-label">Material:</span>
                <span className="spec-value">Heavy-duty vinyl with reinforced edges</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Sizes Available:</span>
                <span className="spec-value">Custom sizing for all equipment types</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Weather Resistance:</span>
                <span className="spec-value">UV, water, and temperature resistant</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Warranty:</span>
                <span className="spec-value">2-year manufacturer warranty</span>
              </div>
            </div>
            <div className="cta-section">
              <h3 className="cta-title">Ready to Protect Your Equipment?</h3>
              <p className="cta-text">Contact us today for a custom quote tailored to your needs.</p>
              <button className="btn-primary large">Contact Sales</button>
            </div>
          </div>
          <div className="details-image">
            <img src="/trackcoverlogo.png" alt="Track Covers Logo" className="logo-image" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default TrackCoversPage;
