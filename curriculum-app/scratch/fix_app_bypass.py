import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove setHasSelectedTheme(true); from useEffect so it always shows on reload
content = re.sub(
    r"document\.documentElement\.setAttribute\('data-theme', savedTheme\);\n\s*setHasSelectedTheme\(true\);",
    "document.documentElement.setAttribute('data-theme', savedTheme);\n      // Deliberately NOT setting hasSelectedTheme so they see the screen on reload",
    content
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
