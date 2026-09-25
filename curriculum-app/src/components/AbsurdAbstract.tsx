import React from 'react';
import { Sparkles, Palette } from 'lucide-react';

interface AbsurdAbstractProps {
  image: string;
  question?: string;
  revealText?: string;
}

export default function AbsurdAbstract({ image, question }: AbsurdAbstractProps) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '2rem auto',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      border: '1px solid #f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      overflowWrap: 'break-word'
    }}>
      {/* Top Banner */}
      <div style={{
        background: 'var(--accent-gradient, var(--accent-primary))',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'white',
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'white' }}>
          <Palette color="#ffffff" size={28} />
          ART INTERPRETATION
          <Sparkles color="#ffffff" size={28} />
        </h2>
      </div>

      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Optional Question/Prompt (Hidden if empty) */}
        {question && question.trim() !== '' && question.trim() !== 'undefined' && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderLeft: '6px solid #475569',
            padding: '1.5rem',
            borderRadius: '0 16px 16px 0',
          }}>
            <p style={{ margin: 0, fontSize: '1.4rem', color: '#334155', fontWeight: '500', lineHeight: '1.5', whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
              {question}
            </p>
          </div>
        )}

        {/* Image Container - Gallery Style */}
        <div style={{
          width: '100%',
          height: '500px',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image} 
            alt="Art Piece" 
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }} 
          />
        </div>
        
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1rem', fontStyle: 'italic' }}>
          What story is this piece trying to tell?
        </div>
      </div>
    </div>
  );
}
