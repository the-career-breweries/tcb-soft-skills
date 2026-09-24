import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

themes_css = """
:root[data-theme='classic'] {
  --bg-app: #f3f4f6;
  --bg-surface: #ffffff;
  --bg-sidebar: #1e293b;
  --text-main: #1f2937;
  --text-muted: #6b7280;
  --text-sidebar: #e2e8f0;
  --text-sidebar-muted: #94a3b8;
  --accent-primary: #2563eb;
  --accent-hover: #1d4ed8;
  --border-color: #e5e7eb;
  --border-sidebar: #334155;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --accent-secondary: #9333ea;
  --accent-gradient: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
}

:root[data-theme='netflix'] {
  --bg-app: #141414;
  --bg-surface: #000000;
  --bg-sidebar: #000000;
  --text-main: #ffffff;
  --text-muted: #808080;
  --text-sidebar: #e5e5e5;
  --text-sidebar-muted: #b3b3b3;
  --accent-primary: #e50914;
  --accent-hover: #b20710;
  --border-color: #2b2b2b;
  --border-sidebar: #141414;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.7);
  --bg-gradient: linear-gradient(135deg, #141414 0%, #000000 100%);
  --accent-secondary: #ff0a16;
  --accent-gradient: linear-gradient(135deg, #e50914 0%, #ff5252 100%);
}

:root[data-theme='prime'] {
  --bg-app: #0f171e;
  --bg-surface: #1a242f;
  --bg-sidebar: #0f171e;
  --text-main: #f2f4f8;
  --text-muted: #798b99;
  --text-sidebar: #f2f4f8;
  --text-sidebar-muted: #798b99;
  --accent-primary: #00a8e1;
  --accent-hover: #0082af;
  --border-color: #252f39;
  --border-sidebar: #1a242f;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.6);
  --bg-gradient: linear-gradient(135deg, #0f171e 0%, #000000 100%);
  --accent-secondary: #00e0ff;
  --accent-gradient: linear-gradient(135deg, #00a8e1 0%, #00e0ff 100%);
}

:root[data-theme='crunchyroll'] {
  --bg-app: #181818;
  --bg-surface: #232323;
  --bg-sidebar: #141414;
  --text-main: #ffffff;
  --text-muted: #a0a0a0;
  --text-sidebar: #e5e5e5;
  --text-sidebar-muted: #a0a0a0;
  --accent-primary: #f47521;
  --accent-hover: #d76016;
  --border-color: #333333;
  --border-sidebar: #1a1a1a;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.6);
  --bg-gradient: linear-gradient(135deg, #181818 0%, #000000 100%);
  --accent-secondary: #ff9d00;
  --accent-gradient: linear-gradient(135deg, #f47521 0%, #ff9d00 100%);
}
"""

content = re.sub(r":root\[data-theme='dark'\] \{[\s\S]*?\}", themes_css.strip(), content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'w', encoding='utf-8') as f:
    f.write(content)
