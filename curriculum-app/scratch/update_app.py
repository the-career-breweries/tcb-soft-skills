import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
content = re.sub(
    r"import WelcomeScreen from '@/components/WelcomeScreen';",
    "import WelcomeScreen from '@/components/WelcomeScreen';\nimport ThemeSelector, { AppTheme } from '@/components/ThemeSelector';",
    content
)

# Update state
content = re.sub(
    r"const \[theme, setTheme\] = useState<'light' \| 'dark'>\('light'\);",
    "const [theme, setTheme] = useState<AppTheme | 'light' | 'dark'>('classic');\n  const [hasSelectedTheme, setHasSelectedTheme] = useState<boolean>(false);",
    content
)

# Update useEffect
use_effect_code = """
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as AppTheme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      setHasSelectedTheme(true);
    } else {
      setTheme('classic');
      document.documentElement.setAttribute('data-theme', 'classic');
    }
  }, []);

  const handleThemeSelection = (selectedTheme: AppTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('app-theme', selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
    setHasSelectedTheme(true);
  };
"""

content = re.sub(
    r"useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);[\s\S]*?document\.documentElement\.setAttribute\('data-theme', newTheme\);\n  \};",
    use_effect_code.strip(),
    content
)

# Inject ThemeSelector at the top of the return block
return_pattern = r"(return \(\n\s+<>\n\s+)\{showWelcome && !showOrientation \?"
new_return = r"\1{!hasSelectedTheme ? (\n          <ThemeSelector onSelectTheme={handleThemeSelection} />\n        ) : showWelcome && !showOrientation ?"

content = re.sub(return_pattern, new_return, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
