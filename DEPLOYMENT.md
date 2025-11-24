# Deployment Guide

## Quick Fixes for White Screen Issues

### 1. Set Environment Variables in Production

**CRITICAL:** You must set these environment variables in your hosting platform:

- `REACT_APP_SHOPIFY_DOMAIN` - Your Shopify store domain (e.g., `pjgf3x-xt.myshopify.com`)
- `REACT_APP_SHOPIFY_STOREFRONT_TOKEN` - Your Shopify Storefront API token

#### For Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add both variables for "Production"
4. Redeploy

#### For Netlify:
1. Go to Site settings → Build & deploy → Environment
2. Add both variables
3. Redeploy

#### For Other Platforms:
Set these as environment variables in your platform's settings before building.

### 2. Verify Server Routing

The app uses React Router, so your server must serve `index.html` for all routes.

- **Vercel**: Use the included `vercel.json` (already configured)
- **Netlify**: Use the included `netlify.toml` and `public/_redirects` (already configured)
- **Other platforms**: Configure your server to serve `index.html` for all routes

### 3. Debug Steps

1. **Open Browser Console** (F12) on your deployed site
2. **Check for errors** - Look for red error messages
3. **Check Network tab** - Verify `bundle.js` loads with status 200
4. **Check Console logs** - You should see "React app is loading..." and "React app rendered successfully"

### 4. Common Issues

#### White Screen with No Errors
- Environment variables not set → Set them in your platform
- Server routing not configured → Use the included config files

#### JavaScript Errors in Console
- Check the error message
- Verify all environment variables are set correctly
- Check that `bundle.js` is loading (Network tab)

#### 404 for bundle.js
- Verify `publicPath: '/'` in `webpack.config.js` (already set)
- Check that the build output includes `bundle.js` in the root of `dist/`

### 5. Rebuild and Redeploy

After making changes:
```bash
npm run build
```

Then deploy the `dist/` folder to your hosting platform.

