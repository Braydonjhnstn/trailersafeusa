import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import TrackCoversPage from './TrackCoversPage';
import ProductsPage from './ProductsPage';
import CartPage from './CartPage';
import AboutPage from './AboutPage';
import FAQPage from './FAQPage';
import { CartProvider, useCart } from './CartContext';

function HomePage() {
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    // Check on mount
    checkMobile();
    
    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Add class to body to prevent scrolling on home page
  useEffect(() => {
    document.body.classList.add('home-page');
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <div className="App">
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
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
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

          {/* OLD LOGO - COMMENTED OUT FOR FUTURE USE
          <div className="logo">
            <span className="logo-text">Trailer</span>
            <span className="logo-text-bold">Safe</span>
            <span className="logo-underline"></span>
            <span className="logo-text-small">USA</span>
          </div>
          */}
          
          {/* NAVIGATION LINKS - REMOVED
          <nav className="header-nav">
            <a href="/products" className="nav-link">Products</a>
            <a href="#about" className="nav-link">About Us</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </nav>
          */}
        </div>
      </header>

      {/* Hero Image Section */}
      <section className="hero-section">
        <img src="/excavator.jpg" alt="Orange Kubota mini-excavator in field" className="hero-image" />
        <div className={`hero-overlay ${isMobile ? 'hero-overlay-mobile' : ''}`}>
          <h1 className="hero-title">Cover Your Tracks</h1>
          <a href="/products" className="hero-shop-button">SHOP NOW</a>
        </div>
      </section>

      {/* Products Section - COMMENTED OUT TO PREVENT SCROLLING */}
      {/* <section id="products" className="products-section">
        <h1 className="products-title">Products</h1>
        <div className="products-grid">
          <div className="product-card">
            <div className="product-image">
              <img src="/trackcover.png" alt="Track Covers" className="product-photo" />
            </div>
            <h3 className="product-header">Track Covers</h3>
            <p className="product-description">Protect your equipment tracks with our durable covers</p>
            <a href="/track-covers" className="product-button">Learn More</a>
          </div>
          
          <div className="product-card">
            <div className="product-image">
              <img src="/excavator.jpg" alt="Equipment Protection" className="product-photo" />
            </div>
            <h3 className="product-header">Equipment Protection</h3>
            <p className="product-description">Comprehensive protection solutions for heavy machinery</p>
            <button className="product-button">Learn More</button>
          </div>
        </div>
      </section> */}

      {/* About Us Section - COMMENTED OUT TO PREVENT SCROLLING */}
      {/* <section id="about" className="about-section">
        <div className="about-content">
          <h2 className="about-title">About Us</h2>
          <p className="about-text">
            Trailer Safe USA is your trusted partner in equipment protection. With years of experience 
            in the industry, we specialize in providing high-quality track covers and protection solutions 
            for heavy machinery and construction equipment.
          </p>
          <p className="about-text">
            Our mission is to help you protect your valuable equipment investments with durable, 
            reliable products that stand up to the toughest working conditions.
          </p>
        </div>
      </section> */}

      {/* FAQ Section - COMMENTED OUT TO PREVENT SCROLLING */}
      {/* <section id="faq" className="faq-section">
        <div className="faq-content">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
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
      </section> */}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/track-covers" element={<TrackCoversPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
