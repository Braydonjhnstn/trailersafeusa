import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { createShopifyCheckout, SHOPIFY_CONFIG } from './shopifyConfig';
import './CartPage.css';
import Footer from './Footer';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity) || 1);
  };

  const handleDecrease = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  const handleIncrease = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes('USD')) {
      return price;
    }
    if (typeof price === 'string' && price.includes('$')) {
      return price;
    }
    return `$${parseFloat(price.replace(/[^0-9.]/g, '')).toFixed(2)}`;
  };

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return (price * item.quantity).toFixed(2);
  };

  const total = getCartTotal().toFixed(2);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      return;
    }

    setIsProcessing(true);
    setCheckoutError(null);

    try {
      // Check if Shopify is configured
      if (!SHOPIFY_CONFIG.domain || !SHOPIFY_CONFIG.storefrontAccessToken) {
        throw new Error('Shopify is not configured. Please contact support.');
      }

      // Create checkout and get URL
      const checkoutUrl = await createShopifyCheckout(cartItems);
      
      // Redirect to Shopify checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error.message || 'Failed to create checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-page">
      {/* Header - Same as ProductsPage */}
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

      {/* Main Content Container */}
      <div className="cart-main-container">
        {/* Title Section */}
        <div className="cart-title-section">
          <h1 className="cart-main-title">Your cart</h1>
          <Link to="/products" className="continue-shopping-link">Continue shopping</Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p className="empty-cart-text">Your cart is empty</p>
            <Link to="/products" className="shop-button">Shop Products</Link>
          </div>
        ) : (
          <>
            {/* Cart Table Headers */}
            <div className="cart-table-headers">
              <div className="cart-header-product">PRODUCT</div>
              <div className="cart-header-quantity">QUANTITY</div>
              <div className="cart-header-total">TOTAL</div>
            </div>

            {/* Cart Items */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-product">
                    <img src={item.image} alt={item.title} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{item.title}</h3>
                      <p className="cart-item-price">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  
                  <div className="cart-item-quantity">
                    <button
                      className="quantity-button decrease"
                      onClick={() => handleDecrease(item.id, item.quantity)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="quantity-input"
                    />
                    <button
                      className="quantity-button increase"
                      onClick={() => handleIncrease(item.id, item.quantity)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="cart-item-total">
                    ${calculateItemTotal(item)}
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Section */}
            <div className="cart-checkout-section">
              <div className="checkout-right">
                <div className="estimated-total">
                  <span className="estimated-total-label">Estimated total</span>
                  <span className="estimated-total-amount">${total} USD</span>
                </div>
                <p className="checkout-note">
                  Taxes, discounts and shipping calculated at checkout.
                </p>
                {checkoutError && (
                  <div className="checkout-error" style={{ 
                    color: '#dc3545', 
                    fontSize: '0.9rem', 
                    marginBottom: '1rem',
                    textAlign: 'right'
                  }}>
                    {checkoutError}
                  </div>
                )}
                <button 
                  className="checkout-button" 
                  onClick={handleCheckout}
                  disabled={isProcessing || cartItems.length === 0}
                  style={{ opacity: isProcessing ? 0.6 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                >
                  {isProcessing ? 'Processing...' : 'Check out'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;

