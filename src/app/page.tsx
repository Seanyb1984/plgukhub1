"use client";

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>PLG UK Hub</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
        Clinical Management System - Live Build
      </p>
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link href="/login" style={{
          backgroundColor: '#0070f3',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Staff Login
        </Link>
        <Link href="/admin" style={{
          border: '1px solid #ccc',
          color: '#333',
          padding: '12px 24px',
          borderRadius: '5px',
          textDecoration: 'none'
        }}>
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}