import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """
        {/* End of Episode Binge UI */}
        {!isLoading && slides.length > 0 && currentSlide === slides.length - 1 && (
          <div style={{
            position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 100,
            background: 'rgba(20,20,20,0.95)', border: '1px solid #333',
            borderRadius: '8px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
            animation: 'fadeInUp 0.5s ease-out forwards'
          }}>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Session Complete</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Ready for more?</span>
            </div>
            <button 
              onClick={onClose}
              style={{
                background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px',
                padding: '0.8rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'transform 0.2s, background 0.2s', fontSize: '1.1rem'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <LayoutDashboard size={24} /> Back to Studio
            </button>
          </div>
        )}
"""

idx = content.find('{/* Floating Right Arrow */}')
if idx != -1:
    end_idx = content.find(')}', idx) + 2
    actual_target = content[idx:end_idx]
    
    # Check if we already inserted it
    if 'End of Episode Binge UI' not in content:
        content = content[:end_idx] + replacement + content[end_idx:]
        with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print('Done')
    else:
        print('Already inserted')
else:
    print('Not found')
