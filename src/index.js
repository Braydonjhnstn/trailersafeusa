// Very simple test without any imports
console.log('Index.js loaded');

// Check if React is available
if (typeof React === 'undefined') {
  console.error('React is not available');
} else {
  console.log('React is available');
}

// Try to render something very basic
const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Root element found');
  rootElement.innerHTML = `
    <div style="padding: 2rem; text-align: center; background: #f0f0f0; min-height: 100vh; font-family: Arial, sans-serif;">
      <h1 style="color: #333;">Basic Test - Server Working</h1>
      <p style="color: #666;">If you see this, the basic setup is working.</p>
      <p style="color: #666;">Time: ${new Date().toLocaleString()}</p>
      <p style="color: #666;">React available: ${typeof React !== 'undefined'}</p>
    </div>
  `;
} else {
  console.error('Root element not found');
}
