# Shopify Integration Setup Guide

This guide will help you set up Shopify API integration for dynamic product listings on your Trailer Safe USA website.

## Prerequisites

1. A Shopify store (you can create a free trial at [shopify.com](https://shopify.com))
2. Admin access to your Shopify store

## Step 1: Create a Private App

1. Log in to your Shopify admin panel
2. Go to **Settings** > **Apps and sales channels**
3. Click **Develop apps** (or **Manage private apps** in older versions)
4. Click **Create an app**
5. Give your app a name (e.g., "Trailer Safe USA Website")
6. Click **Create app**

## Step 2: Configure Storefront API Access

1. In your app settings, click **Configuration**
2. Under **Storefront API access**, check **Allow this app to access your storefront data using the Storefront API**
3. Select the following scopes:
   - `unauthenticated_read_product_listings` - Read product listings
   - `unauthenticated_read_product_inventory` - Read product inventory
   - `unauthenticated_read_product_tags` - Read product tags
4. Click **Save**

## Step 3: Get Your Access Token

1. After saving, go to **API credentials** tab
2. Under **Storefront access token**, click **Install app** if not already installed
3. Copy the **Storefront access token** (starts with `shpat_`)

## Step 4: Configure Your Website

1. Create a `.env` file in your project root:
   ```bash
   touch .env
   ```

2. Add your Shopify credentials to the `.env` file:
   ```env
   REACT_APP_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_your_access_token_here
   ```

3. Replace the placeholder values:
   - `your-store.myshopify.com` with your actual store domain
   - `shpat_your_access_token_here` with your actual Storefront access token

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm start
   ```

2. Navigate to `/products` to see your Shopify products
3. Click on any product to view its details

## Features Included

### Product Listing Page (`/products`)
- Displays all products from your Shopify store
- Responsive grid layout
- Product images, titles, prices, and descriptions
- Load more functionality for pagination
- Sale badges for discounted items
- Stock status indicators

### Product Detail Page (`/products/[handle]`)
- Individual product pages
- Image gallery with thumbnails
- Product variants/options
- Detailed descriptions
- Price display with sale prices
- Add to cart functionality (ready for implementation)

### Components
- `ProductCard` - Individual product display
- `ProductsGrid` - Grid layout for multiple products
- `ProductDetail` - Full product detail view
- `useProducts` - React hook for product data management

## Customization

### Styling
- All components have their own CSS files
- Colors and styling match your existing design
- Fully responsive design

### Product Display
- Modify `ProductCard.js` to change how products are displayed
- Update `ProductsGrid.js` to change the grid layout
- Customize `ProductDetail.js` for individual product pages

### Data Fetching
- Update `shopifyService.js` to modify API calls
- Add new GraphQL queries for additional data
- Modify `useProducts.js` hook for different data management

## Troubleshooting

### Common Issues

1. **"Shopify is not properly configured" error**
   - Check your `.env` file exists and has correct values
   - Restart your development server after adding environment variables

2. **No products showing**
   - Verify your products are published in Shopify
   - Check that your Storefront API token has correct permissions
   - Ensure your store domain is correct

3. **Images not loading**
   - Check that product images are properly uploaded in Shopify
   - Verify image URLs are accessible

4. **CORS errors**
   - This shouldn't happen with Storefront API, but if it does, check your domain configuration

### Debug Mode

To enable debug logging, add this to your `.env` file:
```env
REACT_APP_DEBUG_SHOPIFY=true
```

## Next Steps

1. **Add to Cart Functionality**: Implement actual cart functionality using Shopify's Cart API
2. **Search and Filtering**: Add product search and category filtering
3. **Collections**: Display products by collections
4. **Customer Accounts**: Add customer login and account management
5. **Checkout**: Integrate Shopify Checkout for purchases

## Support

For issues with this integration:
1. Check the browser console for error messages
2. Verify your Shopify app configuration
3. Test with a simple product first
4. Check the Shopify API documentation for updates

## Security Notes

- Never commit your `.env` file to version control
- Keep your Storefront access token secure
- Consider using environment-specific tokens for production
