import React, { useState, useEffect } from 'react';
import { Tv, Play, Search, Gamepad2, Briefcase } from 'lucide-react';

export type AppTheme = 'netflix' | 'prime' | 'crunchyroll' | 'classic';

interface ThemeSelectorProps {
  onSelectTheme: (theme: AppTheme) => void;
}

const posters = [
  // Art (Van Gogh, Abstract, Classic)
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=400&h=600',
  // Movies (Cinema, Horror, Thriller vibes)
  'https://images.unsplash.com/photo-1604998103924-89e012e5265a?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1505686994433-677134ce5a1c?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400&h=600',
  // Books & Stories
  'https://images.unsplash.com/photo-1589998059171-9899ea853229?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1478147424095-201b1739c6d4?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=600',
  // Debate / Talent Show / Stage
  'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1470229722913-7c092fb13b30?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=600',
];

// Fixed offsets to prevent hydration mismatches
const row1 = [...posters.slice(0, 7), ...posters.slice(7), ...posters.slice(0, 7)];
const row2 = [...posters.slice(5), ...posters.slice(0, 5), ...posters.slice(3, 10)];
const row3 = [...posters.slice(10), ...posters.slice(0, 10), ...posters.slice(2, 9)];

export default function ThemeSelector({ onSelectTheme }: ThemeSelectorProps) {
  const [hoveredTheme, setHoveredTheme] = useState<AppTheme | null>(null);

  const themes = [
    {
      id: 'netflix' as AppTheme,
      name: 'Binge Mode',
      brand: 'NETFLIX',
      icon: <Play size={64} />,
      color: '#e50914',
      bg: 'linear-gradient(to bottom, rgba(20,20,20,0) 0%, rgba(20,20,20,1) 100%), url("https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop")',
    },
    {
      id: 'prime' as AppTheme,
      name: 'Prime Focus',
      brand: 'prime video',
      icon: <Search size={64} />,
      color: '#00a8e1',
      bg: 'linear-gradient(to bottom, rgba(15,23,30,0) 0%, rgba(15,23,30,1) 100%), url("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop")',
    },
    {
      id: 'crunchyroll' as AppTheme,
      name: 'Anime Hub',
      brand: 'crunchyroll',
      icon: <Gamepad2 size={64} />,
      color: '#f47521',
      bg: 'linear-gradient(to bottom, rgba(24,24,24,0) 0%, rgba(24,24,24,1) 100%), url("https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1974&auto=format&fit=crop")',
    },
    {
      id: 'classic' as AppTheme,
      name: 'Classic Studio',
      brand: 'TCB LMS',
      icon: <Briefcase size={64} />,
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
      {/* --- CSS Animations for Scrolling Background --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .poster-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          width: max-content;
        }
        .poster-img {
          width: 200px;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
          opacity: 0.4;
          filter: grayscale(40%) contrast(120%);
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
      `}} />

      {/* --- Scrolling Background --- */}
      <div style={{
        position: 'absolute',
        top: '-15%', left: '-15%', right: '-15%', bottom: '-15%',
        transform: 'rotate(-8deg) scale(1.1)',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <div className="poster-row" style={{ animation: 'scrollLeft 90s linear infinite' }}>
          {row1.map((url, i) => <img key={i} src={url} className="poster-img" alt="Poster" />)}
        </div>
        <div className="poster-row" style={{ animation: 'scrollRight 100s linear infinite' }}>
          {row2.map((url, i) => <img key={i} src={url} className="poster-img" alt="Poster" />)}
        </div>
        <div className="poster-row" style={{ animation: 'scrollLeft 80s linear infinite' }}>
          {row3.map((url, i) => <img key={i} src={url} className="poster-img" alt="Poster" />)}
        </div>
        <div className="poster-row" style={{ animation: 'scrollRight 110s linear infinite' }}>
          {row1.map((url, i) => <img key={i} src={url} className="poster-img" alt="Poster" />)}
        </div>
      </div>

      {/* Extreme Dark Overlay with Radial Gradient so the center pops */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 60%, #000 100%)',
        zIndex: 1
      }} />

      {/* Hover Color Tint overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: hoveredTheme ? themes.find(t => t.id === hoveredTheme)?.color : '#000',
        opacity: hoveredTheme ? 0.25 : 0,
        transition: 'all 0.5s ease',
        mixBlendMode: 'color',
        zIndex: 2
      }} />

      {/* --- Foreground UI --- */}
      <div style={{ zIndex: 10, textAlign: 'center', marginBottom: '5rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '800', margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
          Who's watching?
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#d1d5db', margin: 0, fontWeight: '500' }}>
          Choose your streaming experience for today's session.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '3rem', zIndex: 10, flexWrap: 'wrap', justifyContent: 'center', padding: '0 2rem' }}>
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
              gap: '1.5rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredTheme === t.id ? 'scale(1.15)' : hoveredTheme ? 'scale(0.95)' : 'scale(1)',
              opacity: hoveredTheme && hoveredTheme !== t.id ? 0.4 : 1
            }}
          >
            <div style={{
              width: '240px',
              height: '340px',
              borderRadius: '16px',
              backgroundImage: t.bg,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2rem',
              border: hoveredTheme === t.id ? `6px solid ${t.color}` : '6px solid transparent',
              boxShadow: hoveredTheme === t.id ? `0 0 40px ${t.color}99, 0 20px 25px -5px rgba(0,0,0,0.8)` : '0 10px 15px -3px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, left: 0, right: 0, bottom: 0, 
                background: hoveredTheme === t.id ? `linear-gradient(to top, ${t.color} 0%, transparent 100%)` : 'none',
                opacity: 0.8,
                zIndex: 1
              }} />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: hoveredTheme === t.id ? 'white' : '#e5e7eb', transition: 'color 0.3s' }}>
                  {t.icon}
                </div>
                <span style={{ 
                  fontWeight: '900', 
                  fontSize: '1rem', 
                  letterSpacing: '0.15em', 
                  textTransform: 'uppercase', 
                  color: t.id === 'classic' ? '#2563eb' : t.color,
                  textShadow: '0 4px 6px rgba(0,0,0,0.9)'
                }}>
                  {t.brand}
                </span>
              </div>
            </div>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: hoveredTheme === t.id ? 'white' : '#9ca3af',
              transition: 'color 0.3s',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}>
              {t.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
