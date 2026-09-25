import re

files = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\computing-skills\ug\bba-aviation\sem1\weekMid-Sem.md',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\computing-skills\ug\bsc-aviation\sem1\weekMid-Sem.md'
]

replacement = "<!-- BLOCK_DIAGRAM_INTERACTIVE -->"

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The current block diagram text in the file spans from "- **Block Diagram of a Computer:**" up to "Output."
    pattern = re.compile(r'- \*\*Block Diagram of a Computer:\*\*.*?Output\.', re.DOTALL)
    
    content = pattern.sub(replacement, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
