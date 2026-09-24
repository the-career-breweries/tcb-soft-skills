import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken block
# The broken block is:
#                 {assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${uploadedUrl} -->` : assetType === 'image' ? ````absurd-abstract
# image: ${uploadedUrl}
# question: Type your question here...
# reveal: Type the reveal truth here!
# ```` : `![Activity Asset](${uploadedUrl})`}

# Let's just find everything between <code ...> and </code>

broken_pattern = r"(<code[^>]*>)\s*\{assetType === 'video' \? `<!-- CINEMA_CLIFFHANGER: \$\{uploadedUrl\} -->` : assetType === 'image' \? ````absurd-abstract\nimage: \$\{uploadedUrl\}\nquestion: Type your question here\.\.\.\nreveal: Type the reveal truth here!\n```` : `!\[Activity Asset\]\(\$\{uploadedUrl\}\)`\}\s*(</code>)"

replacement = r"\1\n                {assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${uploadedUrl} -->` : assetType === 'image' ? `\\`\\`\\`absurd-abstract\\nimage: ${uploadedUrl}\\nquestion: Type your question here...\\nreveal: Type the reveal truth here!\\n\\`\\`\\`` : `![Activity Asset](${uploadedUrl})`}\n              \2"

new_content = re.sub(broken_pattern, replacement, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
