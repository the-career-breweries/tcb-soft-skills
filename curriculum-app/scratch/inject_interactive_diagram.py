with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import ComputingQuiz from './ComputingQuiz';", "import ComputingQuiz from './ComputingQuiz';\nimport BlockDiagramInteractive from './BlockDiagramInteractive';")

injection = """
                {slides.length > 0 && slides[currentSlide].includes('<!-- BLOCK_DIAGRAM_INTERACTIVE -->') && (
                  <BlockDiagramInteractive />
                )}
"""

content = content.replace(".replace(/<!-- COMPUTING_QUIZ -->/g, '')", ".replace(/<!-- COMPUTING_QUIZ -->/g, '')\n                      .replace(/<!-- BLOCK_DIAGRAM_INTERACTIVE -->/g, '')")

content = content.replace("                  <ComputingQuiz />\n                )}", "                  <ComputingQuiz />\n                )}" + injection)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
