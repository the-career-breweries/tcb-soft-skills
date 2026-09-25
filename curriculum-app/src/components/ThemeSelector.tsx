import React, { useState, useRef } from 'react';
import { Plane, PlaneTakeoff, Users, MessageSquare, PlaySquare, Gamepad2 } from 'lucide-react';

export type AppTheme = 'netflix' | 'prime' | 'crunchyroll' | 'classic' | 'youtube' | 'game';

interface ThemeSelectorProps {
  onSelectTheme: (theme: AppTheme) => void;
}

const validUnsplashIds = [
  '1514525253161-7a46d19cd819', // Stage
  '1489599849927-2ee91cede3ba', // Theatre
  '1579783902614-a3fb3927b6a5', // Art
  '1440404653325-ab127d49abc1', // Film
  '1512820790803-83ca734da794', // Books
  '1536440136628-849c177e76a1', // Clapper
  '1511512578047-dfb367046420', // Neon
  '1577083552431-6e5fd01aa342', // Painting
];

const posters = validUnsplashIds.map(id => `https://images.unsplash.com/photo-${id}?q=80&w=400&h=600&fit=crop`);

// Fixed offsets to prevent hydration mismatches
const row1 = [...posters, ...posters, ...posters];
const row2 = [...posters.slice(4), ...posters, ...posters, ...posters.slice(0, 4)];
const row3 = [...posters.slice(2), ...posters, ...posters, ...posters.slice(0, 2)];

// --- Custom Animated Icons ---

const NeftlexLogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e50914" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" 
              style={{
                transformOrigin: '3px 11px',
                transition: 'transform 0.1s ease-in-out',
                transform: isHovered ? 'rotate(15deg)' : 'rotate(0deg)',
                animation: isHovered ? 'clap 0.3s infinite alternate' : 'none'
              }} />
        <path d="m6.2 5.3 3.1 3.9" />
        <path d="m12.4 3.4 3.1 4" />
        <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      </svg>
      <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#e50914', letterSpacing: '2px', fontFamily: '"Arial Black", sans-serif' }}>
        &CHILL
      </span>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes clap {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(15deg); }
        }
      `}} />
    </div>
  );
};

const AeroPrimeLogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        transition: 'all 0.5s ease-in-out',
        transform: isHovered ? 'translate(20px, -20px) scale(1.1) rotate(15deg)' : 'translate(0px, 0px) scale(1) rotate(0deg)',
        opacity: isHovered ? 0.8 : 1
      }}>
        <Plane size={48} color="#00a8e1" strokeWidth={1.5} />
      </div>
      <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#00a8e1', letterSpacing: '1px', fontStyle: 'italic' }}>
        aero prime
      </span>
    </div>
  );
};

const BrunchroLogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        transition: 'all 0.8s ease-in-out',
        transform: isHovered ? 'translateX(30px) translateY(-15px) rotate(-15deg)' : 'translateX(0px) translateY(0px) rotate(0deg)'
      }}>
        <PlaneTakeoff size={48} color="#f47521" strokeWidth={1.5} />
      </div>
      <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#f47521', letterSpacing: '1px', textAlign: 'center', lineHeight: '1.1' }}>
        BRUNCH"<br/>RO!!
      </span>
    </div>
  );
};

const TcbClassicLogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Users size={48} color="#2563eb" strokeWidth={1.5} />
        
        {/* Interviewer Speech Bubble */}
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '-20px',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1)' : 'scale(0)',
          transition: 'all 0.3s ease 0.1s',
          animation: isHovered ? 'bounce 1s infinite alternate' : 'none'
        }}>
          <MessageSquare size={24} color="#2563eb" />
        </div>

        {/* Interviewee Speech Bubble */}
        <div style={{
          position: 'absolute',
          top: '-5px',
          right: '-25px',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1)' : 'scale(0)',
          transition: 'all 0.3s ease 0.4s',
          animation: isHovered ? 'bounce 1s infinite alternate 0.5s' : 'none'
        }}>
          <MessageSquare size={24} color="#2563eb" style={{ transform: 'scaleX(-1)' }} />
        </div>
      </div>
      <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#2563eb', letterSpacing: '2px' }}>
        TCB CLASSIC
      </span>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-5px); }
        }
      `}} />
    </div>
  );
};



const FlyTubeLogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
      }}>
        <PlaySquare size={48} color="#ff0000" strokeWidth={1.5} />
      </div>
      <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ff0000', letterSpacing: '-1px', fontFamily: '"Oswald", sans-serif' }}>
        FlyTube
      </span>
    </div>
  );
};

const GameItLogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        transition: 'all 0.2s ease-in-out',
        transform: isHovered ? 'translateY(-10px) rotate(-5deg)' : 'translateY(0px) rotate(0deg)',
        filter: isHovered ? 'drop-shadow(0 0 15px rgba(34, 197, 94, 0.8))' : 'none'
      }}>
        <Gamepad2 size={48} color="#22c55e" strokeWidth={1.5} />
      </div>
      <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#22c55e', letterSpacing: '2px', fontFamily: '"Press Start 2P", monospace', textTransform: 'uppercase' }}>
        Let's Game It!
      </span>
    </div>
  );
};

export default function ThemeSelector({ onSelectTheme }: ThemeSelectorProps) {
  const [hoveredTheme, setHoveredTheme] = useState<AppTheme | null>(null);

  const themes = [
    {
      id: 'netflix' as AppTheme,
      name: 'Bing\'',
      logoComponent: <NeftlexLogo isHovered={hoveredTheme === 'netflix'} />,
      color: '#e50914',
      // Red cinema seats
      bg: 'linear-gradient(to bottom, rgba(20,20,20,0) 0%, rgba(20,20,20,1) 100%), url("https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2069&auto=format&fit=crop")',
    },
    {
      id: 'prime' as AppTheme,
      name: 'Prime Focus',
      logoComponent: <AeroPrimeLogo isHovered={hoveredTheme === 'prime'} />,
      color: '#00a8e1',
      // Airplane wing / sky
      bg: 'linear-gradient(to bottom, rgba(15,23,30,0) 0%, rgba(15,23,30,1) 100%), url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop")',
    },
    {
      id: 'crunchyroll' as AppTheme,
      name: 'Anime Hub',
      logoComponent: <BrunchroLogo isHovered={hoveredTheme === 'crunchyroll'} />,
      color: '#f47521',
      // Runway
      bg: 'linear-gradient(to bottom, rgba(24,24,24,0) 0%, rgba(24,24,24,1) 100%), url("https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop")',
    },
    {
      id: 'classic' as AppTheme,
      name: 'Classic Studio',
      logoComponent: <TcbClassicLogo isHovered={hoveredTheme === 'classic'} />,
      color: '#2563eb',
      // Office / Interview space
      bg: 'linear-gradient(to bottom, rgba(243,244,246,0) 0%, rgba(243,244,246,1) 100%), url("https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop")',
    },
    {
      id: 'youtube' as AppTheme,
      name: 'FlyTube',
      logoComponent: <FlyTubeLogo isHovered={hoveredTheme === 'youtube'} />,
      color: '#ff0000',
      bg: 'linear-gradient(to bottom, rgba(15,15,15,0) 0%, rgba(15,15,15,1) 100%), url("https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop")',
    },
    {
      id: 'game' as AppTheme,
      name: "Let's Game It!",
      logoComponent: <GameItLogo isHovered={hoveredTheme === 'game'} />,
      color: '#9146FF',
      bg: 'linear-gradient(to bottom, rgba(24,24,27,0) 0%, rgba(24,24,27,1) 100%), url("https://images.unsplash.com/photo-1538681105587-85640961bf8b?q=80&w=2070&auto=format&fit=crop")',
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
          opacity: 0.6;
          filter: contrast(120%);
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

      {/* Lightened Dark Overlay so posters are visible */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.9) 100%)',
        zIndex: 1
      }} />

      {/* Hover Color Tint overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: hoveredTheme ? themes.find(t => t.id === hoveredTheme)?.color : '#000',
        opacity: hoveredTheme ? 0.35 : 0,
        transition: 'all 0.5s ease',
        mixBlendMode: 'color',
        zIndex: 2
      }} />

      {/* --- Foreground UI --- */}
      <div style={{ zIndex: 10, textAlign: 'center', marginBottom: '5rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
          What's playin'?
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#d1d5db', margin: 0, fontWeight: '500' }}>
          Choose your streaming experience for today's session.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', zIndex: 10, flexWrap: 'wrap', justifyContent: 'center', padding: '0 2rem' }}>
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
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredTheme === t.id ? 'scale(1.15)' : hoveredTheme ? 'scale(0.95)' : 'scale(1)',
              opacity: hoveredTheme && hoveredTheme !== t.id ? 0.4 : 1
            }}
          >
            <div style={{
              width: '180px',
              height: '260px',
              borderRadius: '16px',
              backgroundImage: t.bg,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '1.25rem',
              border: hoveredTheme === t.id ? `4px solid ${t.color}` : '4px solid transparent',
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
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {t.logoComponent}
                </div>
              </div>
            </div>
            <span style={{ 
              fontSize: '1.1rem', 
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
