import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ComingSoon from './ComingSoon';

// ============================================================================
// COMING SOON MODE
// ----------------------------------------------------------------------------
// The full storefront is preserved in the repo as a benchmark for the upcoming
// redesign, but is currently INACTIVE — every route renders <ComingSoon />.
//
// The Shopify integration (shopifyConfig.js) and cart (CartContext.js) are left
// completely untouched so the store can be switched back on unchanged.
//
// TO RESTORE THE FULL STOREFRONT:
//   1. Uncomment the imports and the storefront <Routes> block below.
//   2. Delete (or comment out) the catch-all ComingSoon route.
// ============================================================================

// import { CartProvider } from './CartContext';
// import HomePage from './HomePage';
// import TrackCoversPage from './TrackCoversPage';
// import ProductsPage from './ProductsPage';
// import CartPage from './CartPage';
// import AboutPage from './AboutPage';
// import FAQPage from './FAQPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </Router>
  );

  // --- Full storefront (inactive — restore by following the steps above) ---
  // return (
  //   <CartProvider>
  //     <Router>
  //       <Routes>
  //         <Route path="/" element={<HomePage />} />
  //         <Route path="/track-covers" element={<TrackCoversPage />} />
  //         <Route path="/products" element={<ProductsPage />} />
  //         <Route path="/cart" element={<CartPage />} />
  //         <Route path="/about" element={<AboutPage />} />
  //         <Route path="/faq" element={<FAQPage />} />
  //       </Routes>
  //     </Router>
  //   </CartProvider>
  // );
}

export default App;
