import React, { useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AbsurdAbstractProps {
  image: string;
  question: string;
  revealText: string;
}

export default function AbsurdAbstract({ image, question, revealText }: AbsurdAbstractProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899']
    });
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      margin: '2rem auto',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      border: '1px solid #f3f4f6',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Banner */}
      <div style={{
        background: 'var(--accent-gradient, var(--accent-primary))',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'white',
        
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Sparkles color="#ffffff" />
          THE ABSURD & ABSTRACT
          <Sparkles color="#ffffff" />
        </h2>
      </div>

      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Discussion Question */}
        <div style={{
          backgroundColor: '#eff6ff',
          borderLeft: '6px solid #3b82f6',
          padding: '1.5rem',
          borderRadius: '0 16px 16px 0',
        }}>
          <p style={{ margin: 0, fontSize: '1.4rem', color: '#1e3a8a', fontWeight: '600', lineHeight: '1.5' }}>
            🤔 {question}
          </p>
        </div>

        {/* Image Container */}
        <div style={{
          width: '100%',
          height: '400px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image} 
            alt="Absurd Art" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'transform 0.5s ease',
              transform: isRevealed ? 'scale(1.05)' : 'scale(1)'
            }} 
          />
        </div>

        {/* Reveal Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100px' }}>
          {!isRevealed ? (
            <button 
              onClick={handleReveal}
              style={{
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '16px 40px',
                borderRadius: '50px',
                fontSize: '1.25rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)',
                transition: 'all 0.2s',
                marginTop: '1rem'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Eye size={24} />
              Reveal The Truth
            </button>
          ) : (
            <div style={{
              animation: 'fadeIn 0.8s ease-out',
              backgroundColor: '#f0fdf4',
              border: '2px dashed #22c55e',
              padding: '2rem',
              borderRadius: '16px',
              width: '100%',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#166534', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>The Truth</h3>
              <p style={{ margin: 0, fontSize: '1.5rem', color: '#15803d', fontWeight: '700', lineHeight: '1.4' }}>
                {revealText}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add keyframes for fadeIn directly in component since globals might not have it */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
