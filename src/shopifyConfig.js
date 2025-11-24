// Shopify API Configuration
// Replace these with your actual Shopify store credentials

// Access environment variables directly (webpack DefinePlugin will replace these at build time)
export const SHOPIFY_CONFIG = {
  // Your Shopify store domain
  // Webpack DefinePlugin will replace process.env.REACT_APP_SHOPIFY_DOMAIN at build time
  domain: process.env.REACT_APP_SHOPIFY_DOMAIN || '',
  
  // Storefront API access token
  // Webpack DefinePlugin will replace process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN at build time
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN || '',
  
  // API version
  apiVersion: '2023-10',
  
  // GraphQL endpoint
  get endpoint() {
    return `https://${this.domain}/api/${this.apiVersion}/graphql.json`;
  }
};

// GraphQL queries for Shopify Storefront API
export const SHOPIFY_QUERIES = {
  // Get all products with basic info
  getProducts: `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            tags
          }
        }
      }
    }
  `,
  
  // Get single product by handle
  getProduct: `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        handle
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
        tags
        options {
          id
          name
          values
        }
      }
    }
  `,
  
  // Create cart (replaces deprecated checkoutCreate)
  createCart: `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
  
  // Add line items to checkout
  addLineItems: `
    mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          webUrl
          totalPrice {
            amount
            currencyCode
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `
};

// Helper function to make GraphQL requests to Shopify
export const shopifyRequest = async (query, variables = {}) => {
  try {
    // Validate configuration before making request
    if (!SHOPIFY_CONFIG.domain || !SHOPIFY_CONFIG.storefrontAccessToken) {
      throw new Error('Shopify configuration is incomplete. Missing domain or access token.');
    }

    if (!query) {
      throw new Error('GraphQL query is required');
    }

    const endpoint = SHOPIFY_CONFIG.endpoint;
    
    if (!endpoint || !endpoint.startsWith('https://')) {
      throw new Error(`Invalid endpoint URL: ${endpoint}`);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('Shopify GraphQL Errors:', data.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    if (!data || !data.data) {
      throw new Error('Invalid response format from Shopify API');
    }

    return data.data;
  } catch (error) {
    console.error('Shopify API request failed:', error);
    throw error;
  }
};

// Helper function to format price
export const formatPrice = (amount, currencyCode = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
};

// Helper function to transform Shopify product data
export const transformProduct = (shopifyProduct) => {
  const product = shopifyProduct.node || shopifyProduct;
  const images = product.images?.edges?.map(edge => edge.node) || [];
  const variants = product.variants?.edges?.map(edge => edge.node) || [];
  
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    handle: product.handle,
    image: images[0]?.url || '/placeholder-product.jpg',
    images: images,
    price: formatPrice(product.priceRange?.minVariantPrice?.amount || 0, product.priceRange?.minVariantPrice?.currencyCode),
    compareAtPrice: product.compareAtPriceRange?.minVariantPrice?.amount 
      ? formatPrice(product.compareAtPriceRange.minVariantPrice.amount, product.compareAtPriceRange.minVariantPrice.currencyCode)
      : null,
    variants: variants.map(variant => ({
      id: variant.id,
      title: variant.title,
      price: formatPrice(variant.price?.amount || 0, variant.price?.currencyCode),
      compareAtPrice: variant.compareAtPrice?.amount 
        ? formatPrice(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)
        : null,
      availableForSale: variant.availableForSale
    })),
    tags: product.tags || [],
    options: product.options || [],
    // Store the first variant ID for checkout purposes
    defaultVariantId: variants[0]?.id || null
  };
};

// Helper function to create Shopify cart/checkout
export const createShopifyCheckout = async (cartItems) => {
  try {
    // Convert cart items to Shopify line items format
    const lines = cartItems.map(item => {
      // Use variantId if available, otherwise try to extract from product ID
      // If the item has a defaultVariantId, use it; otherwise use the product ID as variant ID
      let variantId = item.variantId || item.defaultVariantId;
      
      // If we still don't have a variant ID, try to use the product ID
      // (Shopify product IDs can sometimes be used, but variant IDs are preferred)
      if (!variantId && item.id) {
        // If the ID looks like a product ID, we need to get the first variant
        // For now, we'll use the product ID and let Shopify handle it
        variantId = item.id;
      }
      
      if (!variantId) {
        throw new Error(`No variant ID found for product: ${item.title}`);
      }
      
      return {
        merchandiseId: variantId,
        quantity: item.quantity
      };
    });

    // Create cart with line items
    const input = {
      lines: lines
    };

    const data = await shopifyRequest(SHOPIFY_QUERIES.createCart, { input });

    if (data.cartCreate.userErrors && data.cartCreate.userErrors.length > 0) {
      const errors = data.cartCreate.userErrors.map(err => err.message).join(', ');
      throw new Error(`Cart creation errors: ${errors}`);
    }

    if (!data.cartCreate.cart || !data.cartCreate.cart.checkoutUrl) {
      throw new Error('Failed to create cart - no checkout URL returned');
    }

    return data.cartCreate.cart.checkoutUrl;
  } catch (error) {
    console.error('Error creating Shopify cart:', error);
    throw error;
  }
};
