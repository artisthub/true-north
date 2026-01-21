'use client';

import { useState } from 'react';

export default function TestForm() {
  const [value, setValue] = useState('');
  
  return (
    <div style={{ padding: '50px', background: '#000', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '20px' }}>Test Form</h1>
      
      {/* Basic HTML input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'white', display: 'block', marginBottom: '10px' }}>
          Basic Input (no styling):
        </label>
        <input 
          type="text" 
          placeholder="Can you type here?"
          style={{ 
            padding: '10px',
            fontSize: '16px',
            width: '300px'
          }}
        />
      </div>

      {/* Input with React state */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'white', display: 'block', marginBottom: '10px' }}>
          React Controlled Input:
        </label>
        <input 
          type="text" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type here..."
          style={{ 
            padding: '10px',
            fontSize: '16px',
            width: '300px',
            background: '#222',
            color: 'white',
            border: '1px solid #555'
          }}
        />
        <p style={{ color: 'white', marginTop: '10px' }}>Value: {value}</p>
      </div>

      {/* Input with form classes */}
      <div style={{ marginBottom: '20px' }}>
        <label className="form-label">
          With Form Classes:
        </label>
        <input 
          type="text" 
          className="form-input"
          placeholder="Test with form-input class"
        />
      </div>
    </div>
  );
}