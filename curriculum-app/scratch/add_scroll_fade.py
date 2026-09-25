with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<div ref={scrollRef} className="slide-content markdown-slide">'
replacement = '<div ref={scrollRef} className="slide-content markdown-slide" onScroll={(e) => setIsScrolledDown(e.currentTarget.scrollTop > 50)}>'

content = content.replace(target, replacement)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
