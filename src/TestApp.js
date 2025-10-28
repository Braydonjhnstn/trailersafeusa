import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Test App - Basic React Working</h1>
      <p>If you can see this, React is working correctly.</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default TestApp;
