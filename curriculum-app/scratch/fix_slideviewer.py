with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

injection = """
                          if (!inline && match && match[1] === 'computing-quiz') {
                            return <ComputingQuiz />;
                          }
                          if (!inline && match && match[1] === 'block-diagram') {
                            return <BlockDiagramInteractive />;
                          }
"""
content = content.replace("if (!inline && match && match[1] === 'topic-generator') {", injection + "                          if (!inline && match && match[1] === 'topic-generator') {")

content = content.replace(".replace(/<!-- COMPUTING_QUIZ -->/g, '')", "")
content = content.replace(".replace(/<!-- BLOCK_DIAGRAM_INTERACTIVE -->/g, '')", "")

old_injection = """
                  {slides.length > 0 && slides[currentSlide].includes('<!-- TOPIC_GENERATOR -->') && (
                    <RandomTopicGenerator />
                  )}
                  {slides.length > 0 && slides[currentSlide].includes('<!-- COMPUTING_QUIZ -->') && (
                    <ComputingQuiz />
                  )}
                  {slides.length > 0 && slides[currentSlide].includes('<!-- BLOCK_DIAGRAM_INTERACTIVE -->') && (
                    <BlockDiagramInteractive />
                  )}
"""
content = content.replace(old_injection, "")

# It's possible the indentation is slightly off, so let's do a more robust manual replacement without regex .DOTALL spanning lines we want to keep
import re
content = re.sub(
    r"\s*\{slides\.length > 0 && slides\[currentSlide\]\.includes\('<!-- TOPIC_GENERATOR -->'\) && \(\s*<RandomTopicGenerator />\s*\)\}\s*\{slides\.length > 0 && slides\[currentSlide\]\.includes\('<!-- COMPUTING_QUIZ -->'\) && \(\s*<ComputingQuiz />\s*\)\}\s*\{slides\.length > 0 && slides\[currentSlide\]\.includes\('<!-- BLOCK_DIAGRAM_INTERACTIVE -->'\) && \(\s*<BlockDiagramInteractive />\s*\)\}",
    "",
    content
)


with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
