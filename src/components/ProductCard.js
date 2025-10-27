import React from 'react';
import { Link } from 'react-router-dom';
import shopifyService from '../services/shopifyService';
import './ProductCard.css';

const ProductCard = ({ product, showDescription = true, className = '' }) => {
  if (!product) return null;

  const primaryImage = product.getPrimaryImage();
  const price = product.getPrice();
  const isOnSale = product.isOnSale();
  const compareAtPrice = product.variants[0]?.compareAtPrice;

  return (
    <div className={`product-card ${className}`}>
      <Link to={`/products/${product.handle}`} className="product-link">
        <div className="product-image-container">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
              className="product-image"
              loading="lazy"
            />
          ) : (
            <div className="product-image-placeholder">
              <span>No Image</span>
            </div>
          )}
          
          {isOnSale && (
            <div className="sale-badge">
              Sale
            </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          
          {showDescription && product.description && (
            <p className="product-description">
              {product.description.length > 100 
                ? `${product.description.substring(0, 100)}...` 
                : product.description
              }
            </p>
          )}

          <div className="product-price">
            {price ? (
              <div className="price-container">
                <span className={`current-price ${isOnSale ? 'sale-price' : ''}`}>
                  {shopifyService.formatPrice(price)}
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

          <div className="product-tags">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="product-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="product-availability">
            {product.variants.some(variant => variant.availableForSale) ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
