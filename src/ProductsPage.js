import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductsPage.css';
import { shopifyRequest, SHOPIFY_QUERIES, transformProduct, SHOPIFY_CONFIG } from './shopifyConfig';

function ProductsPage() {
  console.log('ProductsPage component rendering');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fallback products in case Shopify API fails
  const getFallbackProducts = () => [
    {
      id: 1,
      title: "Heavy Duty Track Covers",
      price: "$89.99",
      compareAtPrice: "$119.99",
      image: "/trackcover.png",
      description: "Premium protection for your equipment tracks",
      variants: [
        { id: 1, title: "Small", price: "$79.99" },
        { id: 2, title: "Medium", price: "$89.99" },
        { id: 3, title: "Large", price: "$99.99" }
      ],
      tags: ["Heavy Duty", "Weather Resistant", "Durable"]
    },
    {
      id: 2,
      title: "Equipment Protection Kit",
      price: "$149.99",
      compareAtPrice: "$199.99",
      image: "/excavator.jpg",
      description: "Complete protection solution for heavy machinery",
      variants: [
        { id: 4, title: "Standard", price: "$149.99" },
        { id: 5, title: "Premium", price: "$179.99" }
      ],
      tags: ["Complete Kit", "Multi-Purpose", "Professional"]
    },
    {
      id: 3,
      title: "Custom Track Covers",
      price: "From $199.99",
      compareAtPrice: null,
      image: "/trackcover.png",
      description: "Custom-sized covers for specific equipment",
      variants: [
        { id: 6, title: "Custom Size", price: "Contact for Quote" }
      ],
      tags: ["Custom", "Made to Order", "Professional"]
    }
  ];


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Step 1: Validate Shopify configuration
        if (!SHOPIFY_CONFIG || !SHOPIFY_CONFIG.domain || !SHOPIFY_CONFIG.storefrontAccessToken) {
          console.warn('Shopify configuration is missing, using fallback data');
          setProducts(getFallbackProducts());
          setLoading(false);
          return;
        }

        // Step 2: Validate required functions exist
        if (!shopifyRequest || !SHOPIFY_QUERIES || !SHOPIFY_QUERIES.getProducts) {
          console.warn('Shopify functions not available, using fallback data');
          setProducts(getFallbackProducts());
          setLoading(false);
          return;
        }

        // Step 3: Attempt to fetch from Shopify API with timeout
        console.log('Attempting to fetch products from Shopify...');
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const apiPromise = shopifyRequest(SHOPIFY_QUERIES.getProducts, { first: 20 });
        
        const data = await Promise.race([apiPromise, timeoutPromise]);
        
        // Step 4: Validate and transform the response
        if (data && data.products && data.products.edges && Array.isArray(data.products.edges) && data.products.edges.length > 0) {
          console.log(`Successfully fetched ${data.products.edges.length} products from Shopify`);
          
          const transformedProducts = data.products.edges
            .map(edge => {
              try {
                if (!edge || !edge.node) {
                  console.warn('Invalid product edge structure:', edge);
                  return null;
                }
                return transformProduct(edge);
              } catch (transformErr) {
                console.error('Error transforming product:', transformErr, edge);
                return null;
              }
            })
            .filter(product => product !== null && product !== undefined); // Remove any null/undefined values
          
          if (transformedProducts.length > 0) {
            console.log(`Successfully transformed ${transformedProducts.length} products`);
            setProducts(transformedProducts);
          } else {
            console.warn('No valid products after transformation, using fallback data');
            setProducts(getFallbackProducts());
          }
        } else {
          console.warn('No products found in Shopify response, using fallback data');
          setProducts(getFallbackProducts());
        }
        
        setLoading(false);
      } catch (err) {
        // Always fallback to mock data on any error
        console.error('Error fetching products from Shopify:', err);
        console.log('Falling back to mock product data');
        setProducts(getFallbackProducts());
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, newQuantity));
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    // TODO: Implement Shopify cart API integration
    console.log(`Adding ${quantity} of product ${selectedProduct.id} to cart`);
    alert(`Added ${quantity} ${selectedProduct.title} to cart! (Demo mode)`);
    handleCloseModal();
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;
    // TODO: Implement Shopify checkout API integration
    console.log(`Buying ${quantity} of product ${selectedProduct.id} now`);
    alert(`Redirecting to checkout for ${quantity} ${selectedProduct.title}... (Demo mode)`);
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-container">
          <h2>Error Loading Products</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="hamburger">
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
          
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="logo">
              <span className="logo-text">Trailer</span>
              <span className="logo-text-bold">Safe</span>
              <span className="logo-underline"></span>
              <span className="logo-text-small">USA</span>
            </div>
          </Link>
          
          <nav className="header-nav">
            <a href="/products" className="nav-link">Products</a>
            <a href="#about" className="nav-link">About Us</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="products-main-container">
        {/* Title Section */}
        <div className="products-title-section">
          <h1 className="products-main-title">Products</h1>
          <div className="products-title-line"></div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="products-filter-bar">
          <div className="filter-group">
            <span className="filter-label">Filter:</span>
            <select className="filter-select">
              <option>Availability</option>
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
            <select className="filter-select">
              <option>Price</option>
              <option>Low to High</option>
              <option>High to Low</option>
            </select>
          </div>
          <div className="sort-group">
            <span className="sort-label">Sort by:</span>
            <select className="sort-select">
              <option>Alphabetically, A-Z</option>
              <option>Alphabetically, Z-A</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            <span className="product-count">{products.length} products</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid-container">
          <div className="products-grid">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.title} className="product-image" />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.title}</h3>
                  <p className="product-price">{product.price.includes('USD') ? product.price : `${product.price} USD`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={handleCloseModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedProduct.image} alt={selectedProduct.title} />
              </div>
              
              <div className="modal-details">
                <h2 className="modal-title">{selectedProduct.title}</h2>
                <p className="modal-price">{selectedProduct.price.includes('USD') ? selectedProduct.price : `${selectedProduct.price} USD`}</p>
                
                {selectedProduct.description && (
                  <p className="modal-description">{selectedProduct.description}</p>
                )}
                
                <div className="modal-quantity">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                  />
                </div>
                
                <div className="modal-actions">
                  <button className="btn-add-to-cart" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                  <button className="btn-buy-now" onClick={handleBuyNow}>
                    Buy it Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
