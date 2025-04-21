'use client';
import React from 'react';

export default function Page() {
  return (
    <main style={{
      position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: '#f6f8fa'
    }}>
      <div style={{
        position: 'absolute',
        top: 250,
        left: 400,
        width: 300,
        padding: 16,
        borderRadius: 8,
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.11)',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{margin: 0, fontWeight: 400}}>Take out the trash</p>
        <small style={{color: '#4b5563'}}>2025-04-21T08:00:00</small>
      </div>
      <div style={{
        position: 'absolute',
        top: 400,
        left: 600,
        width: 300,
        padding: 16,
        borderRadius: 8,
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.11)',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{margin: 0, fontWeight: 400}}>Finish lesson plan</p>
        <small style={{color: '#4b5563'}}>2025-04-21T12:00:00</small>
      </div>
    </main>
  );
}
