import React, { useState } from 'react';
import { Tv, Play, Search, Gamepad2, Briefcase } from 'lucide-react';

export type AppTheme = 'netflix' | 'prime' | 'crunchyroll' | 'classic';

interface ThemeSelectorProps {
  onSelectTheme: (theme: AppTheme) => void;
}

export default function ThemeSelector({ onSelectTheme }: ThemeSelectorProps) {
  const [hoveredTheme, setHoveredTheme] = useState<AppTheme | null>(null);

  const themes = [
    {
      id: 'netflix' as AppTheme,
      name: 'Binge Mode',
      brand: 'NETFLIX',
      icon: <Play size={40} />,
      color: '#e50914',
      bg: 'linear-gradient(to bottom, rgba(20,20,20,0) 0%, rgba(20,20,20,1) 100%), url("https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop")',
    },
    {
      id: 'prime' as AppTheme,
      name: 'Prime Focus',
      brand: 'prime video',
      icon: <Search size={40} />,
      color: '#00a8e1',
      bg: 'linear-gradient(to bottom, rgba(15,23,30,0) 0%, rgba(15,23,30,1) 100%), url("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop")',
    },
    {
      id: 'crunchyroll' as AppTheme,
      name: 'Anime Hub',
      brand: 'crunchyroll',
      icon: <Gamepad2 size={40} />,
      color: '#f47521',
      bg: 'linear-gradient(to bottom, rgba(24,24,24,0) 0%, rgba(24,24,24,1) 100%), url("https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1974&auto=format&fit=crop")',
    },
    {
      id: 'classic' as AppTheme,
      name: 'Classic Studio',
      brand: 'TCB LMS',
      icon: <Briefcase size={40} />,
      color: '#2563eb',
      bg: 'linear-gradient(to bottom, rgba(243,244,246,0) 0%, rgba(243,244,246,1) 100%), url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")',
    }
  ];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow based on hovered theme */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: hoveredTheme ? themes.find(t => t.id === hoveredTheme)?.color : '#000',
        opacity: hoveredTheme ? 0.15 : 0,
        transition: 'all 0.5s ease',
        zIndex: 0
      }} />

      <div style={{ zIndex: 10, textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
          Who's watching?
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#9ca3af', margin: 0 }}>
          Choose your streaming experience for today's session.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', zIndex: 10, flexWrap: 'wrap', justifyContent: 'center', padding: '0 2rem' }}>
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTheme(t.id)}
            onMouseEnter={() => setHoveredTheme(t.id)}
            onMouseLeave={() => setHoveredTheme(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredTheme === t.id ? 'scale(1.05)' : hoveredTheme ? 'scale(0.95)' : 'scale(1)',
              opacity: hoveredTheme && hoveredTheme !== t.id ? 0.6 : 1
            }}
          >
            <div style={{
              width: '200px',
              height: '280px',
              borderRadius: '12px',
              backgroundImage: t.bg,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '1.5rem',
              border: hoveredTheme === t.id ? `4px solid ${t.color}` : '4px solid transparent',
              boxShadow: hoveredTheme === t.id ? `0 0 30px ${t.color}66` : '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, left: 0, right: 0, bottom: 0, 
                background: hoveredTheme === t.id ? `linear-gradient(to top, ${t.color} 0%, transparent 100%)` : 'none',
                opacity: 0.6,
                zIndex: 1
              }} />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ color: hoveredTheme === t.id ? 'white' : '#e5e7eb', transition: 'color 0.3s' }}>
                  {t.icon}
                </div>
                <span style={{ 
                  fontWeight: '900', 
                  fontSize: '0.8rem', 
                  letterSpacing: '0.1em', 
                  textTransform: 'uppercase', 
                  color: t.id === 'classic' ? '#2563eb' : t.color,
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}>
                  {t.brand}
                </span>
              </div>
            </div>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: hoveredTheme === t.id ? 'white' : '#9ca3af',
              transition: 'color 0.3s'
            }}>
              {t.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
