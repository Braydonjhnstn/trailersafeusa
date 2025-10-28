import React from 'react';

function SimpleApp() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '1rem' }}>
        Trailer Safe USA
      </h1>
      <p style={{ color: '#6c757d', fontSize: '1.2rem' }}>
        Your website is working! React is functioning correctly.
      </p>
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Basic Test Page</h2>
        <p>If you can see this, the basic React app is working.</p>
        <p>Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

export default SimpleApp;
