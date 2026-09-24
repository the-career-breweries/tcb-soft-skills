import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """{assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${uploadedUrl} -->` : assetType === 'image' ? ````absurd-abstract\\nimage: ${uploadedUrl}\\nquestion: Type your question here...\\nreveal: Type the reveal truth here!\\n```` : `![Activity Asset](${uploadedUrl})`}"""

content = re.sub(
    r"\{assetType === 'video' \? `<!-- CINEMA_CLIFFHANGER: \$\{uploadedUrl\} -->` : `!\[Activity Asset\]\(\$\{uploadedUrl\}\)`\}",
    replacement,
    content
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
