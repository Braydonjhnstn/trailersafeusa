# Quick Setup Instructions

## ✅ Token Configured
Your Shopify token `ef5db8c02a424aa34969c41c2a45620a` has been added to the configuration.

## 🔧 Next Steps

### 1. Update Your Store Domain
You need to replace `your-store.myshopify.com` with your actual Shopify store domain.

**Option A: Create .env file (Recommended)**
```bash
# Create .env file in project root
echo "REACT_APP_SHOPIFY_STORE_DOMAIN=your-actual-store.myshopify.com" > .env
echo "REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN=ef5db8c02a424aa34969c41c2a45620a" >> .env
```

**Option B: Update config file directly**
Edit `src/config/shopify.js` and replace `your-store.myshopify.com` with your actual store domain.

### 2. Find Your Store Domain
1. Log into your Shopify admin
2. Look at the URL - it will be something like `https://your-store-name.myshopify.com`
3. Use `your-store-name.myshopify.com` as your domain

### 3. Test the Integration
1. Restart your development server:
   ```bash
   npm start
   ```
2. Navigate to `http://localhost:3000/products`
3. You should see your Shopify products!

## 🚨 Important Notes

- Make sure your products are **published** in Shopify
- Verify your Storefront API app has the correct permissions
- Check that your store domain is exactly correct (including `.myshopify.com`)

## 🆘 If Products Don't Show

1. Check browser console for errors
2. Verify your store domain is correct
3. Make sure products are published in Shopify
4. Check that your token has the right permissions

## 📞 Need Help?

The full setup guide is in `SHOPIFY_SETUP.md` with detailed instructions for creating the Shopify app and getting permissions.
