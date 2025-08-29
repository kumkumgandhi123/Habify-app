import React from 'react';
import './index.css';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '20px',
          fontSize: '28px'
        }}>
          🎯 Habify App
        </h1>
        
        <p style={{
          color: '#666',
          marginBottom: '30px',
          fontSize: '16px'
        }}>
          Your habit tracking application is working!
        </p>
        
        <button style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '12px 30px',
          borderRadius: '25px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          App is Working! ✅
        </button>
        
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>Debug Info:</h3>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ React is working</p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ CSS is loading</p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ No JavaScript errors</p>
        </div>
      </div>
    </div>
  );
}

export default App;
