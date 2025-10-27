import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import shopifyService from '../services/shopifyService';
import './ProductDetail.css';

const ProductDetail = () => {
  const { handle } = useParams();
  const { product, loading, error } = useProduct(handle);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="error-state">
          <h2>Unable to load product</h2>
          <p>{error}</p>
          <Link to="/" className="back-button">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="not-found-state">
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/" className="back-button">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const currentVariant = selectedVariant || product.variants[0];
  const isOnSale = product.isOnSale();
  const compareAtPrice = currentVariant?.compareAtPrice;

  return (
    <div className="product-detail-container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.title}</span>
      </div>

      <div className="product-detail-content">
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.images[selectedImageIndex]?.url || '/placeholder-image.jpg'}
              alt={product.images[selectedImageIndex]?.altText || product.title}
              className="product-main-image"
            />
            {isOnSale && (
              <div className="sale-badge">
                Sale
              </div>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={image.altText || product.title}
                    className="thumbnail-image"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          
          <div className="product-price">
            {currentVariant?.price ? (
              <div className="price-container">
                <span className={`current-price ${isOnSale ? 'sale-price' : ''}`}>
                  {shopifyService.formatPrice(currentVariant.price)}
                </span>
                {isOnSale && compareAtPrice && (
                  <span className="compare-price">
                    {shopifyService.formatPrice(compareAtPrice)}
                  </span>
                )}
              </div>
            ) : (
              <span className="price-unavailable">Price not available</span>
            )}
          </div>

          {product.description && (
            <div className="product-description">
              <h3>Description</h3>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}

          {product.variants.length > 1 && (
            <div className="product-variants">
              <h3>Options</h3>
              <div className="variant-options">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`variant-option ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-availability">
            {currentVariant?.availableForSale ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          {product.tags.length > 0 && (
            <div className="product-tags">
              <h3>Tags</h3>
              <div className="tags-container">
                {product.tags.map((tag, index) => (
                  <span key={index} className="product-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="product-actions">
            <button
              className="add-to-cart-button"
              disabled={!currentVariant?.availableForSale}
            >
              {currentVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="wishlist-button">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
