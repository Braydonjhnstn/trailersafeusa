import React from 'react';
import ProductCard from './ProductCard';
import './ProductsGrid.css';

const ProductsGrid = ({ 
  products, 
  loading, 
  error, 
  onLoadMore, 
  hasMore, 
  showDescription = true,
  className = '' 
}) => {
  if (loading && products.length === 0) {
    return (
      <div className={`products-grid-container ${className}`}>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`products-grid-container ${className}`}>
        <div className="error-state">
          <h3>Unable to load products</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`products-grid-container ${className}`}>
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Check back later for new products!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`products-grid-container ${className}`}>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showDescription={showDescription}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="load-more-container">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="load-more-button"
          >
            {loading ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
