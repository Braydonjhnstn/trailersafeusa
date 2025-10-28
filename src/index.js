import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

// Clear any existing content
container.innerHTML = '';

// Render the React app
root.render(<App />);
