import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r"\`4px solid \${t.color}\`", "`4px solid ${t.color}`")
content = content.replace(r"\`0 0 30px \${t.color}66\`", "`0 0 30px ${t.color}66`")
content = content.replace(r"\`linear-gradient(to top, \${t.color} 0%, transparent 100%)\`", "`linear-gradient(to top, ${t.color} 0%, transparent 100%)`")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
