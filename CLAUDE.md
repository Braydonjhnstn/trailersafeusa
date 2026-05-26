# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this is

**Trailer Safe USA** — a single-page React storefront that sells **"Bigfoot" rubber track
covers** for compact heavy equipment (mini-excavators, skid steers, compact track loaders).

The core customer flow: pick your machine's **Make → Model**, which resolves to one or more
**rubber track sizes**; matching products are shown, and checkout is handed off to **Shopify**.

There is no custom backend. Product data and checkout come from Shopify's Storefront API;
the cart lives in the browser (`localStorage`).

## Commands

```bash
npm install        # install dependencies
npm start          # dev server with hot reload at http://localhost:3000
npm run dev        # same as start, but opens the browser
npm run build      # production build into dist/
```

There is **no test runner and no linter configured** — don't run `npm test`/`npm run lint`.

## Tech stack

- **React 18** (function components + hooks; one class component: `ErrorBoundary`)
- **React Router 7** (`BrowserRouter`) — client-side routing
- **Webpack 5 + Babel** for bundling (no Create React App, no Vite). Config: [webpack.config.js](webpack.config.js)
- **Plain CSS**, one stylesheet per page (no CSS modules, no Tailwind, no preprocessor)
- **Shopify Storefront API** (GraphQL) for products + checkout

## Environment variables

Required for live Shopify data; without them the app silently uses hardcoded fallback products.

| Variable | Purpose |
|---|---|
| `REACT_APP_SHOPIFY_DOMAIN` | Store domain, e.g. `your-store.myshopify.com` |
| `REACT_APP_SHOPIFY_STOREFRONT_TOKEN` | Storefront API access token |

- **Local:** put them in a `.env` file at the repo root (gitignored). Webpack reads `.env`
  only in development via `dotenv` + `dotenv-webpack`.
- **Production (Vercel/Netlify):** set them in the host's dashboard. `webpack.DefinePlugin`
  inlines `process.env.REACT_APP_*` at build time — they are **baked into the bundle**, so a
  rebuild is required after changing them.

## Source layout (`src/` is flat — no subfolders)

| File | Responsibility |
|---|---|
| `index.js` | Entry point; mounts `<App>` inside `<ErrorBoundary>` |
| `App.js` | Router + route table, and the `HomePage` component (hero) |
| `Header.js` | **Shared** site header: hamburger menu, logo, optional search modal, cart icon |
| `Footer.js` | Shared footer |
| `ProductsPage.js` | Catalog: fetch, Make/Model + text search, product modal, add-to-cart / buy-now |
| `CartPage.js` | Cart line items, quantity controls, checkout |
| `AboutPage.js`, `FAQPage.js`, `TrackCoversPage.js` | Static content pages |
| `CartContext.js` | Cart state via React Context, persisted to `localStorage` |
| `shopifyConfig.js` | Shopify config, GraphQL queries, request helper, product transform, checkout creation |
| `equipmentData.js` | Make/Model lists + track-size fitment data and lookup helpers |
| `ErrorBoundary.js` | Top-level error fallback UI |

Routes (see [src/App.js](src/App.js)): `/` `/products` `/cart` `/about` `/faq` `/track-covers`.

## Key conventions & gotchas

- **The header is a shared component.** Edit nav links, logo, search, or cart icon in
  [src/Header.js](src/Header.js) — **not** per page. Pass `showSearch={false}` to hide the
  header's search icon/modal (ProductsPage does this because it has its own in-page search bar).
- **Header styling is global.** `Header.js` reuses class names (`.header`, `.hamburger`,
  `.search-modal`, …) that are defined inside each page's CSS file. Those CSS rules are loaded
  globally by `style-loader`, so the shared header renders consistently. If you add a brand-new
  page, make sure its CSS (or an imported one) defines these classes.
- **Fitment search data lives in [src/equipmentData.js](src/equipmentData.js).** To add a
  machine or fix a track size, edit `MAKES`, `MODELS_BY_MAKE`, and `TRACK_SIZE_TO_MODELS` there.
  `getTrackSizesForModel(model)` returns an array (a model can map to several sizes) or `null`.
  Search then matches those track-size strings against product title/description/tags.
- **Graceful Shopify fallback.** If the API is unconfigured, times out (10s), or errors,
  `ProductsPage` falls back to `getFallbackProducts()` (mock data) instead of erroring. Checkout
  buttons still require real Shopify config and will show an error message if it's missing.
- **Money is stored as formatted strings** (e.g. `"$89.99"`); cart math strips non-numeric
  characters via `parseFloat(price.replace(/[^0-9.]/g, ''))`. Keep that in mind when touching
  price logic in `CartContext.js` / `CartPage.js`.
- **Public assets** live in `public/` and are referenced by absolute path (e.g. `/new.logo2.png`).
  `CopyWebpackPlugin` copies `public/` into `dist/` at build time. The header logo is
  `public/new.logo2.png`.

## Deployment

Configured for both hosts; both serve the SPA by rewriting all routes to `index.html`:

- **Vercel** — [vercel.json](vercel.json) (rewrites + long-cache headers for `/static/*`)
- **Netlify** — [netlify.toml](netlify.toml) + [public/_redirects](public/_redirects)

Build command `npm run build`, output directory `dist/`. See [DEPLOYMENT.md](DEPLOYMENT.md) for
the white-screen / env-var checklist.
