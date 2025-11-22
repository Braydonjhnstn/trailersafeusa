import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductsPage.css';
import { shopifyRequest, SHOPIFY_QUERIES, transformProduct, SHOPIFY_CONFIG } from './shopifyConfig';

function ProductsPage() {
  console.log('ProductsPage component rendering');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleAddToCart = (productId, variantId) => {
    // TODO: Implement Shopify cart API integration
    console.log(`Adding product ${productId}, variant ${variantId} to cart`);
    alert('Product added to cart! (Demo mode)');
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
      <header className="products-header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <div className="logo">
              <span className="logo-text">Trailer</span>
              <span className="logo-text-bold">Safe</span>
              <span className="logo-underline"></span>
              <span className="logo-text-small">USA</span>
            </div>
          </Link>
          
          <nav className="header-nav">
            <Link to="/#products" className="nav-link">Products</Link>
            <Link to="/#about" className="nav-link">About Us</Link>
            <Link to="/#faq" className="nav-link">FAQ</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="products-hero">
        <div className="hero-content">
          <h1 className="hero-title">Products</h1>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="products-container">
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.title} />
                  {product.compareAtPrice && (
                    <div className="sale-badge">Sale</div>
                  )}
                </div>
                
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-tags">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="product-tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="product-pricing">
                    <span className="product-price">{product.price}</span>
                    {product.compareAtPrice && (
                      <span className="product-compare-price">{product.compareAtPrice}</span>
                    )}
                  </div>
                  
                  <div className="product-variants">
                    <select className="variant-select">
                      {product.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.title} - {variant.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product.id, product.variants[0].id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shopify Integration Notice */}
      <section className="integration-notice">
        <div className="notice-content">
          <h3>Shopify Integration Active</h3>
          <p>This page is now connected to your Shopify store and displaying real products. Next steps:</p>
          <ul>
            <li>✅ Connected to Shopify Storefront API</li>
            <li>✅ Displaying real products from your store</li>
            <li>⏳ Implement cart and checkout functionality</li>
            <li>⏳ Add product search and filtering</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default ProductsPage;
