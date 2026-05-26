import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './ProductsPage.css';
import { shopifyRequest, SHOPIFY_QUERIES, transformProduct, SHOPIFY_CONFIG, createShopifyCheckout } from './shopifyConfig';
import { MAKES, getModelsForMake, getTrackSizesForModel } from './equipmentData';
import { useCart } from './CartContext';
import Header from './Header';
import Footer from './Footer';

function ProductsPage() {
  const { addToCart, cartItems } = useCart();
  const [isBuyNowProcessing, setIsBuyNowProcessing] = useState(false);
  const [buyNowError, setBuyNowError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Remove home-page class and allow scrolling on products page
  useEffect(() => {
    document.body.classList.remove('home-page');
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
  }, []);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(null); // null = no search performed, [] = search performed with no results
  const [currentTrackSizes, setCurrentTrackSizes] = useState([]); // Track sizes for the current search (array to handle multiple)
  const [searchError, setSearchError] = useState(null); // Error message if search fails
  const [textSearchQuery, setTextSearchQuery] = useState(''); // Text search query from search bar

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

        // Use fallback data if Shopify isn't configured or its helpers are missing
        if (!SHOPIFY_CONFIG || !SHOPIFY_CONFIG.domain || !SHOPIFY_CONFIG.storefrontAccessToken) {
          setProducts(getFallbackProducts());
          setLoading(false);
          return;
        }

        if (!shopifyRequest || !SHOPIFY_QUERIES || !SHOPIFY_QUERIES.getProducts) {
          setProducts(getFallbackProducts());
          setLoading(false);
          return;
        }

        // Fetch from Shopify with a timeout so a hung request still falls back
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        const apiPromise = shopifyRequest(SHOPIFY_QUERIES.getProducts, { first: 20 });
        const data = await Promise.race([apiPromise, timeoutPromise]);

        // Validate and transform the response
        if (data && data.products && Array.isArray(data.products.edges) && data.products.edges.length > 0) {
          const transformedProducts = data.products.edges
            .map(edge => {
              try {
                if (!edge || !edge.node) return null;
                return transformProduct(edge);
              } catch (transformErr) {
                console.error('Error transforming product:', transformErr, edge);
                return null;
              }
            })
            .filter(product => product !== null && product !== undefined);

          setProducts(transformedProducts.length > 0 ? transformedProducts : getFallbackProducts());
        } else {
          setProducts(getFallbackProducts());
        }

        setLoading(false);
      } catch (err) {
        // Always fall back to mock data on any error
        console.error('Error fetching products from Shopify:', err);
        setProducts(getFallbackProducts());
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search query from URL parameter
  useEffect(() => {
    const queryParam = searchParams.get('search');
    if (queryParam) {
      setTextSearchQuery(queryParam);
      // Auto-focus search input when coming from search icon
      setTimeout(() => {
        const searchInput = document.getElementById('text-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }, [searchParams]);

  // Filter products by text search query (only if model search is not active)
  useEffect(() => {
    // If model search is active, don't override it with text search
    if (selectedModel && filteredProducts !== null) {
      return;
    }

    if (textSearchQuery.trim()) {
      const query = textSearchQuery.toLowerCase().trim();
      const filtered = products.filter(product => {
        const title = (product.title || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        return title.includes(query) || description.includes(query);
      });
      setFilteredProducts(filtered);
    } else if (!selectedModel) {
      // Only reset if we're not in model search mode
      setFilteredProducts(null);
    }
  }, [textSearchQuery, products, selectedModel]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setBuyNowError(null);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, newQuantity));
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, quantity);
    handleCloseModal();
  };

  const handleBuyNow = async () => {
    if (!selectedProduct) return;

    setIsBuyNowProcessing(true);
    setBuyNowError(null);

    try {
      if (!SHOPIFY_CONFIG.domain || !SHOPIFY_CONFIG.storefrontAccessToken) {
        throw new Error('Shopify is not configured. Please contact support.');
      }

      // Same as Add to Cart: add product to cart (merge quantity if already in cart)
      addToCart(selectedProduct, quantity);

      // Build checkout items = current cart + this product (mirrors the cart merge logic)
      const existingItem = cartItems.find(item => item.id === selectedProduct.id);
      const checkoutItems = existingItem
        ? cartItems.map(item =>
            item.id === selectedProduct.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...cartItems, { ...selectedProduct, quantity }];

      const checkoutUrl = await createShopifyCheckout(checkoutItems);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Buy now checkout error:', error);
      setBuyNowError(error.message || 'Failed to start checkout. Please try again.');
      setIsBuyNowProcessing(false);
    }
  };

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    setSelectedModel(''); // Reset model when make changes
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSearch = () => {
    setSearchError(null);
    // Clear text search when doing model search
    setTextSearchQuery('');
    setSearchParams({});

    if (!selectedModel) {
      // If no model is selected, don't filter
      setFilteredProducts(null);
      setCurrentTrackSizes([]);
      return;
    }

    try {
      // Get all track sizes for the selected model (can be multiple)
      const trackSizes = getTrackSizesForModel(selectedModel);

      if (!trackSizes || trackSizes.length === 0) {
        setFilteredProducts([]);
        setCurrentTrackSizes([]);
        setSearchError(`No track size found for model "${selectedModel}". Please check the model name or contact support.`);
        return;
      }

      setCurrentTrackSizes(trackSizes);

      // Filter products that mention any of the track sizes in title, description, or tags
      const filtered = products.filter(product => {
        const productTitle = (product.title || '').toLowerCase();
        const productDescription = (product.description || '').toLowerCase();
        const productTags = (product.tags || []).map(tag => tag.toLowerCase());

        return trackSizes.some(trackSize => {
          const trackSizeLower = trackSize.toLowerCase();
          return productDescription.includes(trackSizeLower) ||
                 productTitle.includes(trackSizeLower) ||
                 productTags.some(tag => tag.includes(trackSizeLower));
        });
      });

      if (filtered.length === 0) {
        setSearchError(`No products found matching track size(s): ${trackSizes.join(', ')}. Try a different model or check if products are available.`);
      }

      setFilteredProducts(filtered);
    } catch (err) {
      console.error('Error during search:', err);
      setSearchError('An error occurred during search. Please try again.');
      setFilteredProducts([]);
      setCurrentTrackSizes([]);
    }
  };

  const handleShowAll = () => {
    setFilteredProducts(null); // Reset to show all products
    setCurrentTrackSizes([]); // Clear track size display
    setSearchError(null); // Clear any error messages
    setSelectedMake('');
    setSelectedModel('');
    setTextSearchQuery(''); // Clear text search
    setSearchParams({}); // Clear URL params
  };

  // Use filtered products if search was performed, otherwise show all products
  // Priority: model search > text search > all products
  const displayProducts = filteredProducts !== null ? filteredProducts : products;

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
      <Header showSearch={false} />

      {/* Main Content Container */}
      <div className="products-main-container">
        {/* Title Section */}
        <div className="products-title-section">
          <h1 className="products-main-title">Products</h1>
          <div className="products-title-line"></div>
        </div>

        {/* Search Bar */}
        <div className="text-search-bar">
          <input
            id="text-search-input"
            type="text"
            className="text-search-input"
            placeholder="Search products by title or description..."
            value={textSearchQuery}
            onChange={(e) => {
              setTextSearchQuery(e.target.value);
              setSearchParams(e.target.value ? { search: e.target.value } : {});
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        </div>

        {/* Dropdown Bar */}
        <div className="products-dropdown-bar">
          <select
            className="dropdown-select"
            value={selectedMake}
            onChange={handleMakeChange}
          >
            <option value="">MAKE</option>
            {MAKES.map((make) => (
              <option key={make.value} value={make.value}>{make.label}</option>
            ))}
          </select>
          <select
            key={selectedMake || 'no-make'}
            className="dropdown-select"
            value={selectedModel}
            onChange={handleModelChange}
            disabled={!selectedMake}
          >
            <option value="">MODEL</option>
            {getModelsForMake(selectedMake).map((model) => (
              <option key={model} value={model.toLowerCase()}>
                {model}
              </option>
            ))}
          </select>
          <button
            className="search-button"
            onClick={handleSearch}
            disabled={!selectedModel}
          >
            SEARCH
          </button>
          <button
            className="show-all-button"
            onClick={handleShowAll}
          >
            SHOW ALL
          </button>
        </div>

        {/* Track Size Display */}
        {currentTrackSizes.length > 0 && (
          <div className="track-size-display">
            <p className="track-size-text">
              <span className="track-size-label">
                {currentTrackSizes.length === 1 ? 'Track Size: ' : 'Track Sizes: '}
              </span>
              <span className="track-size-value">
                {currentTrackSizes.join(', ')}
              </span>
            </p>
          </div>
        )}

        {/* Error Message Display */}
        {searchError && (
          <div className="search-error-display">
            <p className="error-text">{searchError}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="products-grid-container">
          <div className="products-grid">
            {displayProducts.map((product) => (
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

                {buyNowError && (
                  <p className="modal-checkout-error">{buyNowError}</p>
                )}
                <div className="modal-actions">
                  <button className="btn-add-to-cart" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                  <button
                    className="btn-buy-now"
                    onClick={handleBuyNow}
                    disabled={isBuyNowProcessing}
                  >
                    {isBuyNowProcessing ? 'Processing…' : 'Buy it Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default ProductsPage;
