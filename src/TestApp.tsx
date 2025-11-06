import React from 'react';

function TestApp() {
  console.log('TestApp rendering');
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333'
    }}>
      <div>
        <h1>Test App is Working!</h1>
        <p>If you can see this, React is rendering correctly.</p>
        <p>Check the browser console for more debug information.</p>
      </div>
    </div>
  );
}

export default TestApp;
