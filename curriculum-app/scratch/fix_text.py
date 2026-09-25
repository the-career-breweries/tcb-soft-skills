import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change NEFTLEX to &CHILL
content = content.replace('NEFTLEX', '&CHILL')

# Change Binge Mode to Bing'
content = content.replace("name: 'Binge Mode'", "name: 'Bing\\''")

# Change BRUNCH'RO!! to BRUNCH"<br/>RO!! and add textAlign center
content = content.replace(
    "<span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#f47521', letterSpacing: '1px' }}>\n        BRUNCH'RO!!\n      </span>",
    "<span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#f47521', letterSpacing: '1px', textAlign: 'center', lineHeight: '1.1' }}>\n        BRUNCH\"<br/>RO!!\n      </span>"
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
