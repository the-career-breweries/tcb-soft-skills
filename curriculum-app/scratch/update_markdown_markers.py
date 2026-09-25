import re

files = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\computing-skills\ug\bba-aviation\sem1\weekMid-Sem.md',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\computing-skills\ug\bsc-aviation\sem1\weekMid-Sem.md'
]

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace("<!-- BLOCK_DIAGRAM_INTERACTIVE -->", "```block-diagram\n```")
    content = content.replace("<!-- COMPUTING_QUIZ -->", "```computing-quiz\n```")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
