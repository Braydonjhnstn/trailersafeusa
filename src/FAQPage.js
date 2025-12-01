import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import './FAQPage.css';
import Footer from './Footer';

function FAQPage() {
  const { getCartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="faq-page">
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
      </header>

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

