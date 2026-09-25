with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = re.sub(
    r"\{slides\.length > 0 && slides\[currentSlide\]\.includes\('<!-- TOPIC_GENERATOR -->'\).*?<BlockDiagramInteractive />\n\s*\)\}",
    "",
    content,
    flags=re.DOTALL
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
