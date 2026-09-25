with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to the components list
injection = """
                          if (!inline && match && match[1] === 'computing-quiz') {
                            return <ComputingQuiz />;
                          }
                          if (!inline && match && match[1] === 'block-diagram') {
                            return <BlockDiagramInteractive />;
                          }
"""
content = content.replace("if (!inline && match && match[1] === 'topic-generator') {", injection + "\n                          if (!inline && match && match[1] === 'topic-generator') {")

# The injected components at the bottom
# Look exactly for the bottom block and remove it
import re

content = re.sub(
    r'                  \{slides\.length > 0 && slides\[currentSlide\]\.includes\(\'<!-- TOPIC_GENERATOR -->\'\) && \(\s*<RandomTopicGenerator />\s*\)\}\s*\{slides\.length > 0 && slides\[currentSlide\]\.includes\(\'<!-- COMPUTING_QUIZ -->\'\) && \(\s*<ComputingQuiz />\s*\)\}\s*\{slides\.length > 0 && slides\[currentSlide\]\.includes\(\'<!-- BLOCK_DIAGRAM_INTERACTIVE -->\'\) && \(\s*<BlockDiagramInteractive />\s*\)\}',
    "",
    content
)

content = content.replace(".replace(/<!-- COMPUTING_QUIZ -->/g, '')", "")
content = content.replace(".replace(/<!-- BLOCK_DIAGRAM_INTERACTIVE -->/g, '')", "")


with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
