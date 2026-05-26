import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { createShopifyCheckout, SHOPIFY_CONFIG } from './shopifyConfig';
import './CartPage.css';
import Header from './Header';
import Footer from './Footer';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

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
      <Header />

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
