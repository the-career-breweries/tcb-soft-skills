import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface Hotspot {
  x: number; // percentage
  y: number; // percentage
  title: string;
  desc: string;
}

interface AnatomyWidgetProps {
  image: string;
  hotspots: Hotspot[];
}

export default function AnatomyWidget({ image, hotspots }: AnatomyWidgetProps) {
  const [activeSpot, setActiveSpot] = useState<number | null>(null);

  return (
    <div style={{
      width: '100%', maxWidth: '900px', margin: '0 auto',
      position: 'relative', borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'normal'
    }} className="escape-subtitle">
      <img src={image} alt="Anatomy" style={{ width: '100%', height: 'auto', display: 'block' }} />
      
      {hotspots.map((spot, index) => (
        <div key={index} style={{
          position: 'absolute', top: `${spot.y}%`, left: `${spot.x}%`,
          transform: 'translate(-50%, -50%)', zIndex: 10
        }}>
          {/* Glowing pulse effect */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--accent-primary, #E50914)', opacity: 0.4,
            animation: 'pulse 2s infinite'
          }} />
          
          {/* The interactive dot */}
          <button
            onMouseEnter={() => setActiveSpot(index)}
            onMouseLeave={() => setActiveSpot(null)}
            style={{
              position: 'relative', width: '24px', height: '24px', borderRadius: '50%',
              background: 'white', border: '4px solid var(--accent-primary, #E50914)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, boxShadow: '0 0 10px rgba(0,0,0,0.5)', transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          
          {/* Tooltip */}
          {activeSpot === index && (
            <div style={{
              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
              marginTop: '12px', width: '250px',
              background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
              padding: '1rem', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              animation: 'fadeInUp 0.2s ease-out', zIndex: 20
            }}>
              {/* Tooltip arrow */}
              <div style={{
                position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)',
                width: '12px', height: '12px', background: 'rgba(15, 23, 42, 0.95)',
                borderLeft: '1px solid rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.2)'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-primary, #E50914)' }}>
                <Info size={18} />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>{spot.title}</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4', color: '#e2e8f0' }}>
                {spot.desc}
              </p>
            </div>
          )}
        </div>
      ))}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}} />
    </div>
  );
}
