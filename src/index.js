import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

// Debug logging to help diagnose production issues
console.log('React app is loading...');
console.log('Root element exists:', !!document.getElementById('root'));

// Catch any errors during initialization
try {
  const container = document.getElementById('root');
  
  if (!container) {
    throw new Error('Root element not found!');
  }
  
  const root = createRoot(container);
  
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
  
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Fatal error during app initialization:', error);
  document.body.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
      <h2 style="color: #dc3545;">Application Error</h2>
      <p>${error.message}</p>
      <p style="color: #666; font-size: 0.9rem;">Check the browser console for more details.</p>
    </div>
  `;
}
