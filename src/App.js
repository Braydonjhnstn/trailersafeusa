import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css';
// import TrackCoversPage from './TrackCoversPage';
// import ProductsPage from './pages/ProductsPage';
// import ProductDetail from './components/ProductDetail';

function HomePage() {
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="hamburger">
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
          
          <div className="logo">
            <span className="logo-text">Trailer</span>
            <span className="logo-text-bold">Safe</span>
            <span className="logo-underline"></span>
            <span className="logo-text-small">USA</span>
          </div>
          
          <nav className="header-nav">
            <a href="#products" className="nav-link">Products</a>
            <a href="#about" className="nav-link">About Us</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Hero Image Section */}
      <section className="hero-section">
        <img src="/excavator.jpg" alt="Orange Kubota mini-excavator in field" className="hero-image" />
      </section>

      {/* Products Section */}
      <section id="products" className="products-section">
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
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
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
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
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
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/track-covers" element={<TrackCoversPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:handle" element={<ProductDetail />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
