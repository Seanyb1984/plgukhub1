"use client";

import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h1>Admin Dashboard</h1>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>← Back to Home</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h3>Client Database</h3>
          <p>Manage and search clinical records.</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h3>Form Submissions</h3>
          <p>Review and sign off clinical forms.</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h3>System Settings</h3>
          <p>Configure sites and user permissions.</p>
        </div>
      </div>
    </div>
  );
}