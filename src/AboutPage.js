import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './AboutPage.css';
import Footer from './Footer';

function AboutPage() {
  const { getCartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  return (
    <div className="about-page">
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
            <img src="/new.logo2.png" alt="Trailer Safe USA" className="logo-image" />
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

