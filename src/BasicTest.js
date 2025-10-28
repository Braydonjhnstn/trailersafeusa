import React from 'react';
import { createRoot } from 'react-dom/client';

// Very basic test to see if React is working
function BasicTest() {
  return React.createElement('div', {
    style: {
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }
  }, 
    React.createElement('h1', { style: { color: '#333' } }, 'Basic React Test'),
    React.createElement('p', { style: { color: '#666' } }, 'If you see this, React is working!'),
    React.createElement('p', { style: { color: '#666' } }, `Time: ${new Date().toLocaleString()}`)
  );
}

// Try to render directly
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(React.createElement(BasicTest));
} else {
  console.error('Root container not found!');
}
