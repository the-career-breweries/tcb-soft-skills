with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r'\n', '\n')

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'w', encoding='utf-8') as f:
    f.write(content)
