import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface Choice {
  text: string;
  isCorrect: boolean;
  reason: string;
}

interface CrisisSimulatorProps {
  question: string;
  choices: Choice[];
}

export default function CrisisSimulator({ question, choices }: CrisisSimulatorProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  return (
    <div style={{
      width: '100%', maxWidth: '800px', margin: '0 auto',
      background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
      padding: '2rem', color: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', color: '#fbbf24' }}>
        <AlertTriangle size={28} />
        <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 'bold' }}>CRISIS SIMULATOR</h3>
      </div>
      
      <p style={{ fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2rem' }}>
        {question}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {choices.map((choice, index) => {
          const isSelected = selectedChoice === index;
          const showSuccess = isSelected && choice.isCorrect;
          const showFail = isSelected && !choice.isCorrect;

          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => setSelectedChoice(index)}
                disabled={selectedChoice !== null}
                style={{
                  background: isSelected 
                    ? (choice.isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)') 
                    : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${isSelected ? (choice.isCorrect ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px', padding: '1.25rem', textAlign: 'left',
                  color: 'white', fontSize: '1.1rem', cursor: selectedChoice !== null ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px'
                }}
                onMouseOver={(e) => {
                  if (selectedChoice === null) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseOut={(e) => {
                  if (selectedChoice === null) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
              >
                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                  {showSuccess && <CheckCircle2 color="#22c55e" size={24} />}
                  {showFail && <XCircle color="#ef4444" size={24} />}
                  {!isSelected && <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />}
                </div>
                <span>{choice.text}</span>
              </button>
              
              {isSelected && (
                <div style={{
                  padding: '1rem', borderRadius: '8px',
                  background: choice.isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: choice.isCorrect ? '#86efac' : '#fca5a5',
                  fontSize: '1rem', borderLeft: `4px solid ${choice.isCorrect ? '#22c55e' : '#ef4444'}`,
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  {choice.reason}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
