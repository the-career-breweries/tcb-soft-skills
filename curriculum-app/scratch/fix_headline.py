import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\AbsurdAbstract.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'", "background: 'var(--accent-gradient, var(--accent-primary))'")
content = content.replace("borderBottom: '4px solid #6366f1'", "")
content = content.replace('color="#a5b4fc"', 'color="#ffffff"')

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\AbsurdAbstract.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
