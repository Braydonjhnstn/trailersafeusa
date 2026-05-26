# Trailer Safe USA

A React storefront for **"Bigfoot" rubber track covers** — protective covers for compact heavy
equipment (mini-excavators, skid steers, compact track loaders).

Customers find the right cover by selecting their machine's **Make → Model**, which maps to one
or more **track sizes**, then check out through **Shopify**.

## Tech stack

- **React 18** + **React Router 7**
- **Webpack 5** + **Babel** (no Create React App / Vite)
- Plain CSS (one stylesheet per page)
- **Shopify Storefront API** (GraphQL) for products and checkout
- Cart state in React Context, persisted to `localStorage`

## Getting started

```bash
npm install
npm start        # http://localhost:3000
```

### Shopify configuration

Live product and checkout data require Shopify credentials. Create a `.env` file in the project
root (it is gitignored):

```env
REACT_APP_SHOPIFY_DOMAIN=your-store.myshopify.com
REACT_APP_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
```

Without these, the Products page automatically falls back to built-in mock products so the UI
still works in development. See [SHOPIFY_SETUP.md](SHOPIFY_SETUP.md) for how to get the token.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server with hot reload |
| `npm run dev` | Dev server, opens the browser |
| `npm run build` | Production build to `dist/` |

## Project structure

```
public/             Static assets + index.html template (copied into dist/)
src/
  index.js          Entry point
  App.js            Router + HomePage (hero)
  Header.js         Shared header (nav, search, cart) — edit nav here, once
  Footer.js         Shared footer
  ProductsPage.js   Catalog, Make/Model + text search, product modal
  CartPage.js       Cart and checkout
  AboutPage.js
  FAQPage.js
  TrackCoversPage.js
  CartContext.js    Cart state (localStorage-backed)
  shopifyConfig.js  Shopify queries, request helper, checkout
  equipmentData.js  Make/Model lists + track-size fitment data
  ErrorBoundary.js
webpack.config.js   Build config
```

Routes: `/` · `/products` · `/cart` · `/about` · `/faq` · `/track-covers`

## Adding equipment to the search

The Make/Model dropdowns and the model → track-size mapping live in
[src/equipmentData.js](src/equipmentData.js). Add a make to `MAKES`, its models to
`MODELS_BY_MAKE`, and map models to track sizes in `TRACK_SIZE_TO_MODELS`.

## Deployment

Builds to `dist/` and deploys as a single-page app on **Vercel** ([vercel.json](vercel.json)) or
**Netlify** ([netlify.toml](netlify.toml)). Set the `REACT_APP_SHOPIFY_*` environment variables in
the host's dashboard — they are baked into the bundle at build time. See
[DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting.

## License

MIT
