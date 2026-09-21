import React from 'react';

export default function QRCodeForm() {
  // This links directly to the feedback page we just built
  const formUrl = "https://tcb-soft-skills.onrender.com/feedback"; 
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(formUrl)}`;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      margin: '2rem auto',
      textAlign: 'center',
      width: '100%',
      maxWidth: '600px'
    }}>
      <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Scan to Access the Session Form
      </h2>
      <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '2rem', marginTop: 0 }}>
        Please open this form now and keep it ready.<br/>You will need it for:
      </p>
      <ul style={{ textAlign: 'left', color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem', listStyleType: 'none', padding: 0 }}>
        <li style={{ marginBottom: '0.5rem' }}>✅ Weekly Activity Responses</li>
        <li style={{ marginBottom: '0.5rem' }}>✅ Session Feedback (Submit at the end)</li>
      </ul>
      <div style={{
        background: '#fff',
        padding: '1rem',
        borderRadius: '12px',
        display: 'inline-block'
      }}>
        <img src={qrImageUrl} alt="QR Code" width="200" height="200" style={{ display: 'block' }} />
      </div>
      <p style={{ marginTop: '1.5rem', marginBottom: 0, fontSize: '0.9rem', color: '#64748b' }}>
        Point your phone camera here to begin.
      </p>
    </div>
  );
}
