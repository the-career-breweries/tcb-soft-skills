import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r"\`6px solid \${t.color}\`", "`6px solid ${t.color}`")
content = content.replace(r"\`0 0 40px \${t.color}99, 0 20px 25px -5px rgba(0,0,0,0.8)\`", "`0 0 40px ${t.color}99, 0 20px 25px -5px rgba(0,0,0,0.8)`")
content = content.replace(r"\`linear-gradient(to top, \${t.color} 0%, transparent 100%)\`", "`linear-gradient(to top, ${t.color} 0%, transparent 100%)`")
content = content.replace(r"\`\n        @keyframes scrollLeft", "`\n        @keyframes scrollLeft")
content = content.replace(r"rgba(0,0,0,0.5);\n        }\n      \`}} />", "rgba(0,0,0,0.5);\n        }\n      `}} />")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
