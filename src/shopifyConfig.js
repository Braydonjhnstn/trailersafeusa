// Shopify API Configuration
// Replace these with your actual Shopify store credentials

export const SHOPIFY_CONFIG = {
  // Your Shopify store domain (e.g., 'your-store.myshopify.com')
  domain: process.env.REACT_APP_SHOPIFY_DOMAIN || 'trailersafeusa.myshopify.com',
  
  // Storefront API access token
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN || 'ef5db8c02a424aa34969c41c2a45620a',
  
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
  
  // Create checkout
  createCheckout: `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
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
    const response = await fetch(SHOPIFY_CONFIG.endpoint, {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
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
    options: product.options || []
  };
};
