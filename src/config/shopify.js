// Shopify Configuration
// Update these values with your actual Shopify store information

export const SHOPIFY_CONFIG = {
  // Your Shopify store domain (e.g., your-store.myshopify.com)
  storeDomain: process.env.REACT_APP_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com',
  
  // Your Shopify Storefront API access token
  // Get this from your Shopify admin under Apps > App and sales channel settings > Develop apps
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'your-storefront-access-token',
  
  // API version
  apiVersion: '2023-10',
  
  // GraphQL endpoint
  get graphqlEndpoint() {
    return `https://${this.storeDomain}/api/${this.apiVersion}/graphql.json`;
  }
};

// Helper function to check if Shopify is properly configured
export const isShopifyConfigured = () => {
  return SHOPIFY_CONFIG.storeDomain !== 'your-store.myshopify.com' && 
         SHOPIFY_CONFIG.storefrontAccessToken !== 'your-storefront-access-token';
};
