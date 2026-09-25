import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_scrubber = """
        {/* Video Scrubber Playbar */}
        {!isLoading && slides.length > 0 && (
          <div style={{
            position: 'absolute', bottom: '0', left: '0', right: '0', zIndex: 100,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
            padding: '2rem 2rem 1.5rem 2rem',
            display: 'flex', flexDirection: 'column', gap: '0.8rem',
            pointerEvents: 'none' /* Let clicks pass through background */
          }}>
            {/* Scrubber Track Wrapper */}
            <div 
              style={{
                width: '100%', height: '16px', display: 'flex', alignItems: 'center', cursor: 'pointer', pointerEvents: 'auto'
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                const newSlide = Math.round(percentage * (slides.length - 1));
                setCurrentSlide(Math.max(0, Math.min(newSlide, slides.length - 1)));
              }}
            >
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.3)', position: 'relative', borderRadius: '2px' }}>
                {/* Progress Fill */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%',
                  width: `${(currentSlide / Math.max(1, slides.length - 1)) * 100}%`,
                  background: '#E50914',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease'
                }} />
                {/* Thumb */}
                <div style={{
                  position: 'absolute', top: '50%', left: `${(currentSlide / Math.max(1, slides.length - 1)) * 100}%`,
                  width: '14px', height: '14px', background: '#E50914', borderRadius: '50%',
                  transform: 'translate(-50%, -50%)', boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  transition: 'left 0.3s ease'
                }} />
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#E50914'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'white'}
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>
                <div style={{ color: 'white', fontSize: '1rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace' }}>
                  <span>{currentSlide === 0 ? '0' : currentSlide}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{slides.length - 1}</span>
                </div>
              </div>
            </div>
          </div>
        )}
"""

content = content.replace('{/* Admin Asset Upload Modal */}', new_scrubber + '\n      {/* Admin Asset Upload Modal */}')

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
