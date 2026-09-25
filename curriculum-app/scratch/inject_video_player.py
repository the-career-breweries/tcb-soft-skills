import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Play, Pause imports
content = content.replace(
    "UploadCloud, LayoutDashboard } from 'lucide-react'",
    "UploadCloud, LayoutDashboard, Play, Pause } from 'lucide-react'"
)

# 2. Add isPlaying state
state_injection = """
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentSlide < slides.length - 1) {
      timer = setInterval(() => {
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
      }, 8000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSlide, slides.length]);

  useEffect(() => {
    if (currentSlide === slides.length - 1) {
      setIsPlaying(false);
    }
  }, [currentSlide, slides.length]);
"""
content = content.replace(
    'const [currentSlide, setCurrentSlide] = useState(0);',
    'const [currentSlide, setCurrentSlide] = useState(0);' + state_injection
)

# 3. Add Scrubber UI
scrubber_ui = """
        {/* Video Scrubber Playbar */}
        {!isLoading && slides.length > 0 && (
          <div style={{
            position: 'absolute', bottom: '0', left: '0', right: '0', zIndex: 20,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
            padding: '4rem 2rem 1.5rem 2rem',
            display: 'flex', flexDirection: 'column', gap: '0.8rem'
          }}>
            {/* Scrubber Track */}
            <div 
              style={{
                width: '100%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px',
                cursor: 'pointer', position: 'relative'
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                const newSlide = Math.round(percentage * (slides.length - 1));
                setCurrentSlide(Math.max(0, Math.min(newSlide, slides.length - 1)));
              }}
            >
              {/* Progress Fill */}
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: `${(currentSlide / Math.max(1, slides.length - 1)) * 100}%`,
                background: 'var(--accent-primary)',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
              {/* Thumb */}
              <div style={{
                position: 'absolute', top: '50%', left: `${(currentSlide / Math.max(1, slides.length - 1)) * 100}%`,
                width: '16px', height: '16px', background: 'white', borderRadius: '50%',
                transform: 'translate(-50%, -50%)', boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                transition: 'left 0.3s ease'
              }} />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'white'}
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
                <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{currentSlide === 0 ? '0' : currentSlide}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{slides.length - 1}</span>
                </div>
              </div>
            </div>
          </div>
        )}
"""

# Insert right after Floating Right Arrow
idx = content.find('</button>\n          )}\n')
if idx != -1:
    end_idx = idx + len('</button>\n          )}\n')
    content = content[:end_idx] + scrubber_ui + content[end_idx:]
else:
    print('Could not find anchor for scrubber UI')

# Overwrite
with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
