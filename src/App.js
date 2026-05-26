import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Header';
import TrackCoversPage from './TrackCoversPage';
import ProductsPage from './ProductsPage';
import CartPage from './CartPage';
import AboutPage from './AboutPage';
import FAQPage from './FAQPage';
import { CartProvider } from './CartContext';

function HomePage() {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device (used to position the hero overlay)
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Add class to body to prevent scrolling on the home page
  useEffect(() => {
    document.body.classList.add('home-page');
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <div className="App">
      <Header />

      {/* Hero Image Section */}
      <section className="hero-section">
        <img src="/excavator.jpg" alt="Orange Kubota mini-excavator in field" className="hero-image" />
        <div className={`hero-overlay ${isMobile ? 'hero-overlay-mobile' : ''}`}>
          <h1 className="hero-title">Cover Your Tracks</h1>
          <a href="/products" className="hero-shop-button">SHOP NOW</a>
        </div>
      </section>
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
