import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace toggleTheme function logic
content = re.sub(
    r"onClick=\{toggleTheme\}",
    "onClick={() => setHasSelectedTheme(false)}",
    content
)

# And if there is a Sun/Moon icon, change it to a TV or Palette icon.
content = re.sub(
    r"\{theme === 'dark' \? <Sun size=\{20\} /> : <Moon size=\{20\} />\}",
    "<Tv size={20} />",
    content
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
