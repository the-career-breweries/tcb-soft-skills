import React from 'react';

export default function QRCodeForm() {
  // This links directly to the feedback page we just built
  const formUrl = "https://thecareerbreweries.onrender.com/feedback/soft-skills"; 
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=2&data=${encodeURIComponent(formUrl)}`;

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
      <h2 style={{ fontSize: '2.2rem', margin: '0 0 1rem 0', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Feedback
      </h2>
      <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '2rem', marginTop: 0 }}>
        Your thoughts help us improve future sessions!
      </p>
      
      <div style={{
        background: '#ffffff',
        padding: '1rem',
        borderRadius: '12px',
        display: 'inline-block',
        margin: '0 auto'
      }}>
        <img 
          src={qrImageUrl} 
          alt="Feedback QR Code" 
          style={{ 
            width: '200px', 
            height: '200px', 
            display: 'block',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box'
          }} 
        />
      </div>
      
      <p style={{ marginTop: '1.5rem', marginBottom: 0, fontSize: '1rem', color: '#64748b' }}>
        Point your phone camera here to begin.
      </p>
    </div>
  );
}
