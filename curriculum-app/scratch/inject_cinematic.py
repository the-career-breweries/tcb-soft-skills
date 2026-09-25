with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

injection = """
  // Extract Cinematic Background URL
  const currentSlideContent = slides[currentSlide] || '';
  const cinematicBgMatch = currentSlideContent.match(/<!-- CINEMATIC_BG: (.*?) -->/);
  const cinematicBgUrl = cinematicBgMatch ? cinematicBgMatch[1].trim() : null;
  const isVideoBg = cinematicBgUrl && (cinematicBgUrl.endsWith('.mp4') || cinematicBgUrl.endsWith('.webm'));

"""

content = content.replace("  return (\n    <div className={`slide-modal-overlay", injection + "  return (\n    <div className={`slide-modal-overlay")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
