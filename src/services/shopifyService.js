// Shopify API Service
// This service handles communication with Shopify's Storefront API

const SHOPIFY_STORE_DOMAIN = process.env.REACT_APP_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'your-storefront-access-token';

const SHOPIFY_GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`;

// GraphQL query to fetch products
const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          description
          handle
          tags
          createdAt
          updatedAt
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
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
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to fetch a single product by handle
const GET_PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      tags
      createdAt
      updatedAt
      images(first: 5) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
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
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

class ShopifyService {
  constructor() {
    this.storeDomain = SHOPIFY_STORE_DOMAIN;
    this.accessToken = SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  }

  // Make GraphQL request to Shopify
  async makeGraphQLRequest(query, variables = {}) {
    try {
      const response = await fetch(SHOPIFY_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.accessToken,
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
        console.error('GraphQL errors:', data.errors);
        throw new Error('GraphQL request failed');
      }

      return data.data;
    } catch (error) {
      console.error('Shopify API request failed:', error);
      throw error;
    }
  }

  // Fetch all products
  async getProducts(first = 20, after = null) {
    try {
      const data = await this.makeGraphQLRequest(GET_PRODUCTS_QUERY, {
        first,
        after,
      });

      return {
        products: data.products.edges.map(edge => this.transformProduct(edge.node)),
        pageInfo: data.products.pageInfo,
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return {
        products: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }
  }

  // Fetch a single product by handle
  async getProductByHandle(handle) {
    try {
      const data = await this.makeGraphQLRequest(GET_PRODUCT_BY_HANDLE_QUERY, {
        handle,
      });

      return data.productByHandle ? this.transformProduct(data.productByHandle) : null;
    } catch (error) {
      console.error('Failed to fetch product by handle:', error);
      return null;
    }
  }

  // Transform Shopify product data to a more usable format
  transformProduct(product) {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      images: product.images.edges.map(edge => ({
        id: edge.node.id,
        url: edge.node.url,
        altText: edge.node.altText,
        width: edge.node.width,
        height: edge.node.height,
      })),
      variants: product.variants.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        price: {
          amount: parseFloat(edge.node.price.amount),
          currencyCode: edge.node.price.currencyCode,
        },
        compareAtPrice: edge.node.compareAtPrice ? {
          amount: parseFloat(edge.node.compareAtPrice.amount),
          currencyCode: edge.node.compareAtPrice.currencyCode,
        } : null,
        availableForSale: edge.node.availableForSale,
        selectedOptions: edge.node.selectedOptions,
      })),
      // Helper methods
      getPrimaryImage: () => product.images.edges[0]?.node || null,
      getPrice: () => product.variants.edges[0]?.node.price || null,
      isOnSale: () => {
        const variant = product.variants.edges[0]?.node;
        return variant?.compareAtPrice && 
               parseFloat(variant.price.amount) < parseFloat(variant.compareAtPrice.amount);
      },
    };
  }

  // Format price for display
  formatPrice(price) {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode,
    }).format(price.amount);
  }

  // Check if service is properly configured
  isConfigured() {
    return this.storeDomain !== 'your-store.myshopify.com' && 
           this.accessToken !== 'your-storefront-access-token';
  }
}

// Create and export a singleton instance
const shopifyService = new ShopifyService();
export default shopifyService;
