import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
content = re.sub(
    r"import QRCodeForm from './QRCodeForm';",
    "import QRCodeForm from './QRCodeForm';\nimport AbsurdAbstract from './AbsurdAbstract';",
    content
)

# 2. Inject markdown rendering rule
markdown_rule = """
                          if (!inline && match && match[1] === 'absurd-abstract') {
                            const lines = String(children).trim().split('\\n');
                            const image = lines.find((l: string) => l.startsWith('image:'))?.replace('image:', '').trim() || '';
                            const question = lines.find((l: string) => l.startsWith('question:'))?.replace('question:', '').trim() || '';
                            const revealText = lines.find((l: string) => l.startsWith('reveal:'))?.replace('reveal:', '').trim() || '';
                            return <AbsurdAbstract image={image} question={question} revealText={revealText} />;
                          }
"""

content = re.sub(
    r"if \(\!inline && match && match\[1\] === 'qrcode'\) \{",
    markdown_rule.strip() + "\n                          if (!inline && match && match[1] === 'qrcode') {",
    content
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
