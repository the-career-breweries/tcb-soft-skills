with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

quiz_injection = """
                {slides.length > 0 && slides[currentSlide].includes('<!-- COMPUTING_QUIZ -->') && (
                  <ComputingQuiz />
                )}
"""

# Replace regex that filters out the marker so the user doesn't see it as text
content = content.replace(".replace(/<!-- TOPIC_GENERATOR -->/g, '')", ".replace(/<!-- TOPIC_GENERATOR -->/g, '')\n                      .replace(/<!-- COMPUTING_QUIZ -->/g, '')")

content = content.replace("                  <RandomTopicGenerator />\n                )}", "                  <RandomTopicGenerator />\n                )}" + quiz_injection)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
