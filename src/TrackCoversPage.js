import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './TrackCoversPage.css';
import Footer from './Footer';

function TrackCoversPage() {
  const { getCartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  
  return (
    <div className="track-covers-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
          
          {isMenuOpen && (
            <>
              <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>
              <div className="dropdown-menu">
                <button className="sidebar-close" onClick={() => setIsMenuOpen(false)}>×</button>
                <Link to="/products" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Products</Link>
                <Link to="/about" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>About</Link>
                <Link to="/faq" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
              </div>
            </>
          )}
          
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="/Logo2.png" alt="Trailer Safe USA" className="logo-image" />
          </Link>
          
          <div className="header-icons">
            <div className="search-icon-link" onClick={() => setIsSearchOpen(true)}>
              <div className="search-icon">
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="white"/>
                </svg>
              </div>
            </div>
            <Link to="/cart" className="cart-icon-link">
              <div className="cart-icon">
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H16.55C17.3 13 17.96 12.59 18.3 11.97L21.88 5.48C21.96 5.34 22 5.17 22 5C22 4.45 21.55 4 21 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="white"/>
                </svg>
                {getCartItemCount() > 0 && (
                  <span className="cart-badge">{getCartItemCount()}</span>
                )}
              </div>
            </Link>
          </div>

          {/* Search Modal */}
          {isSearchOpen && (
            <>
              <div className="search-modal-overlay" onClick={() => setIsSearchOpen(false)}></div>
              <div className="search-modal">
                <input
                  type="text"
                  className="search-modal-input"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchInput.trim()) {
                      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
                      setIsSearchOpen(false);
                      setSearchInput('');
                    }
                  }}
                  autoFocus
                />
                <button className="search-modal-close" onClick={() => setIsSearchOpen(false)}>×</button>
              </div>
            </>
          )}
        </div>
      </header>
      
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
