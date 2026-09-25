import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Overlay class
content = content.replace('<div className={`slide-modal-overlay ${isPrintingSlide ? \'is-printing-slide\' : \'\'}`}>',
                          '<div className={`slide-modal-overlay ${isPrintingSlide ? \'is-printing-slide\' : \'\'} ${course === \'soft-skills\' ? \'video-player-mode\' : \'\'}`}>')

# 2. Add Left/Right arrows back, and make them conditional on course !== 'soft-skills'
arrows = """
        {/* Floating Left Arrow */}
        {course !== 'soft-skills' && !isLoading && slides.length > 0 && currentSlide > 0 && (
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
            className="nav-btn"
            style={{ position: 'absolute', top: '50%', left: '2rem', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '0.5rem' }}
          >
            <ChevronLeft size={48} />
          </button>
        )}

        {/* Floating Right Arrow */}
        {course !== 'soft-skills' && !isLoading && slides.length > 0 && currentSlide < slides.length - 1 && (
          <button 
            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
            className="nav-btn"
            style={{ position: 'absolute', top: '50%', right: '2rem', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '0.5rem' }}
          >
            <ChevronRight size={48} />
          </button>
        )}
"""
content = content.replace('{/* End of Episode Binge UI */}', arrows + '\n          {/* End of Episode Binge UI */}')

# 3. Update Binge UI condition
content = content.replace('!isLoading && slides.length > 0 && currentSlide === slides.length - 1 && (',
                          '!isLoading && slides.length > 0 && currentSlide === slides.length - 1 && course === \'soft-skills\' && (')

# 4. Add "Mark Session Complete" button back (conditional on course !== 'soft-skills')
# It should be placed right after the Binge UI block
session_complete = """
        {course !== 'soft-skills' && activeSection && currentSlide === slides.length - 1 && (
          <button onClick={onClose} className="session-complete-btn" style={{ position: 'absolute', bottom: '2rem', right: '2rem' }}>
            Mark Session Complete
          </button>
        )}
"""
content = content.replace('    <div style={{ display: \'flex\', flexDirection: \'column\' }}>\n                <span style={{ fontSize: \'0.8rem\'', '    <div style={{ display: \'flex\', flexDirection: \'column\' }}>\n                <span style={{ fontSize: \'0.8rem\'')
# Wait, I need a reliable anchor for Mark Session Complete. Let's find RandomTopicGenerator
content = content.replace('                    <RandomTopicGenerator />\n                  )}',
                          '                    <RandomTopicGenerator />\n                  )}\n' + session_complete)

# 5. Update Video Scrubber Playbar condition
content = content.replace('{/* Video Scrubber Playbar */}\n        {!isLoading && slides.length > 0 && (',
                          '{/* Video Scrubber Playbar */}\n        {course === \'soft-skills\' && !isLoading && slides.length > 0 && (')

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
