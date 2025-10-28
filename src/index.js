import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import TestApp from './TestApp';

const container = document.getElementById('root');
const root = createRoot(container);

// Try to render the main app, fallback to test app if there's an error
try {
  root.render(<App />);
} catch (error) {
  console.error('Error rendering main app:', error);
  root.render(<TestApp />);
}
