import React, { useState } from 'react';

export default function SentenceActivity({ data }: { data: string }) {
  const [step, setStep] = useState(0);

  // Parse lines: Sentence:, Type:, Explanation:
  const lines = data.split('\n').filter(line => line.trim().length > 0);
  let sentence = '';
  let type = '';
  let explanation = '';

  lines.forEach(line => {
    if (line.startsWith('Sentence:')) sentence = line.replace('Sentence:', '').trim();
    if (line.startsWith('Type:')) type = line.replace('Type:', '').trim();
    if (line.startsWith('Explanation:')) explanation = line.replace('Explanation:', '').trim();
  });

  return (
    <div className="activity-container" style={{
      border: '2px solid var(--border-color, #ccc)',
      borderRadius: '8px',
      padding: '2rem',
      marginTop: '2rem',
      backgroundColor: 'var(--bg-surface, #f9fafb)',
      color: 'var(--text-main, #1f2937)',
      textAlign: 'left',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ fontSize: '1.4em', marginBottom: '1rem', fontWeight: 600 }}>Analyze this sentence:</h3>
      <p style={{ 
        fontSize: '1.2em', 
        marginBottom: '2rem', 
        fontStyle: 'italic', 
        padding: '1rem', 
        backgroundColor: 'var(--bg-app, #ffffff)', 
        borderLeft: '4px solid var(--accent-primary, #3b82f6)',
        wordWrap: 'break-word',
        whiteSpace: 'normal'
      }}>
        "{sentence}"
      </p>

      {step >= 1 && (
        <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s' }}>
          <strong style={{ fontSize: '1.2em', color: 'var(--accent-primary, #3b82f6)' }}>Type: </strong> 
          <span style={{ fontSize: '1.2em', fontWeight: 600 }}>{type}</span>
        </div>
      )}

      {step >= 2 && (
        <div style={{ animation: 'fadeIn 0.5s' }}>
          <strong style={{ fontSize: '1.1em', color: '#10b981' }}>Why? </strong> 
          <span style={{ fontSize: '1.1em', lineHeight: '1.6' }}>{explanation}</span>
        </div>
      )}

      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {step < 2 && (
          <button 
            onClick={() => setStep(step + 1)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--accent-primary, #3b82f6)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1em',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {step === 0 ? 'Reveal Type' : 'Reveal Explanation'}
          </button>
        )}
        {step > 0 && (
          <button 
            onClick={() => setStep(0)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-muted, #6b7280)',
              border: '1px solid var(--border-color, #d1d5db)',
              borderRadius: '4px',
              fontSize: '1em',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
