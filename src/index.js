import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import TestApp from './TestApp';
import SimpleApp from './SimpleApp';

const container = document.getElementById('root');
const root = createRoot(container);

// Try to render the main app, fallback to simple app if there's an error
try {
  root.render(<App />);
} catch (error) {
  console.error('Error rendering main app:', error);
  try {
    root.render(<TestApp />);
  } catch (testError) {
    console.error('Error rendering test app:', testError);
    root.render(<SimpleApp />);
  }
}
