import re
with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace slide-body container
old_slide_body = """             )}
             <div className="slide-body">
                {slides.length > 0 && (
                  <div className="markdown-content-container" style={{ position: 'relative', width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '2rem', paddingBottom: '4rem' }}>
"""

new_slide_body = """             )}
             <div className="slide-body" style={{ position: 'relative' }}>
                {cinematicBgUrl && (
                  <div className="cinematic-bg-container">
                    {isVideoBg ? (
                      <video src={cinematicBgUrl} autoPlay loop muted playsInline className="cinematic-bg-media" />
                    ) : (
                      <img src={cinematicBgUrl} alt="Cinematic Background" className="cinematic-bg-media" />
                    )}
                    <div className="cinematic-bg-overlay" />
                  </div>
                )}
                {slides.length > 0 && (
                  <div className={`markdown-content-container ${cinematicBgUrl ? 'subtitle-mode' : ''}`} style={{ position: 'relative', width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: cinematicBgUrl ? 'flex-end' : 'flex-start', paddingTop: '2rem', paddingBottom: '4rem', zIndex: 1 }}>
"""
content = content.replace(old_slide_body, new_slide_body)

# Remove marker from being rendered
content = content.replace(
    ".replace(/<!-- TOPIC_GENERATOR -->/g, '')",
    ".replace(/<!-- TOPIC_GENERATOR -->/g, '')\n                      .replace(/<!-- CINEMATIC_BG: (.*?) -->/g, '')"
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
