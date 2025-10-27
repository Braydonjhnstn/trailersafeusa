import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductsGrid from '../components/ProductsGrid';
import './ProductsPage.css';

const ProductsPage = () => {
  const { products, loading, error, loadMore, hasMore } = useProducts(12);

  return (
    <div className="products-page">
      <header className="products-page-header">
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

      <main className="products-page-main">
        <div className="products-hero">
          <h1>Our Products</h1>
          <p>Discover our range of high-quality equipment protection solutions</p>
        </div>

        <ProductsGrid
          products={products}
          loading={loading}
          error={error}
          onLoadMore={loadMore}
          hasMore={hasMore}
          showDescription={true}
        />
      </main>
    </div>
  );
};

export default ProductsPage;
