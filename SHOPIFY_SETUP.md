# Shopify Integration Setup

This project includes a products page that integrates with Shopify's Storefront API to display products from your Shopify store.

## Setup Instructions

### 1. Create a Shopify Store
If you don't have a Shopify store yet, create one at [shopify.com](https://shopify.com).

### 2. Enable Storefront API
1. Go to your Shopify Admin dashboard
2. Navigate to Apps > App and sales channel settings
3. Click "Develop apps" and create a new app
4. Enable the Storefront API access
5. Generate a Storefront access token

### 3. Configure Environment Variables
Create a `.env` file in the project root with the following variables:

```env
# Your Shopify store domain (e.g., 'your-store.myshopify.com')
REACT_APP_SHOPIFY_DOMAIN=your-store.myshopify.com

# Storefront API access token from your Shopify admin
REACT_APP_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
```

### 4. Update Shopify Configuration
Edit `src/shopifyConfig.js` and replace the placeholder values with your actual store credentials.

### 5. Test the Integration
1. Start the development server: `npm start`
2. Navigate to `/products` to see the products page
3. The page will currently show mock data until you configure the actual Shopify integration

## Features

- **Product Listing**: Displays products from your Shopify store
- **Product Details**: Shows product images, descriptions, pricing, and variants
- **Add to Cart**: Placeholder functionality for adding products to cart
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Shows loading spinners while fetching data
- **Error Handling**: Displays error messages if API calls fail

## Current Status

The products page is set up with:
- ✅ Mock product data for demonstration
- ✅ Product card components with images, pricing, and variants
- ✅ Responsive grid layout
- ✅ Loading and error states
- ✅ Shopify API configuration structure
- ⏳ Actual Shopify API integration (requires store setup)

## Next Steps

To complete the integration:
1. Set up your Shopify store and get API credentials
2. Replace mock data with actual API calls in `ProductsPage.js`
3. Implement cart functionality using Shopify's checkout API
4. Add product search and filtering
5. Implement user authentication if needed

## API Endpoints Used

- **Products**: `GET /api/2023-10/graphql.json` - Fetch all products
- **Product Details**: `GET /api/2023-10/graphql.json` - Fetch single product
- **Checkout**: `POST /api/2023-10/graphql.json` - Create and manage checkout

## GraphQL Queries

The project includes pre-built GraphQL queries for:
- Fetching all products with variants and pricing
- Fetching individual product details
- Creating checkout sessions
- Adding items to cart

All queries are defined in `src/shopifyConfig.js`.
