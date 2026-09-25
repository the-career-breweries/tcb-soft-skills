with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

new_themes = """

:root[data-theme='youtube'] {
  --bg-app: #0f0f0f;
  --bg-surface: #212121;
  --bg-sidebar: #0f0f0f;
  --border-subtle: #303030;
  --text-main: #f1f1f1;
  --text-muted: #aaaaaa;
  --accent-primary: #ff0000;
  --accent-primary-hover: #cc0000;
  --bg-gradient: linear-gradient(135deg, #0f0f0f 0%, #000000 100%);
  --accent-secondary: #ff4e4e;
  --accent-gradient: linear-gradient(135deg, #ff0000 0%, #ff4e4e 100%);
}

:root[data-theme='game'] {
  --bg-app: #0a0a0a;
  --bg-surface: #171717;
  --bg-sidebar: #050505;
  --border-subtle: #262626;
  --text-main: #f5f5f5;
  --text-muted: #a3a3a3;
  --accent-primary: #22c55e;
  --accent-primary-hover: #16a34a;
  --bg-gradient: linear-gradient(135deg, #0a0a0a 0%, #000000 100%);
  --accent-secondary: #4ade80;
  --accent-gradient: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
}
"""

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'a', encoding='utf-8') as f:
    f.write(new_themes)
