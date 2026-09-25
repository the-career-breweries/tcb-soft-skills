import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Delete ALL instances of the scrubber from {/* Video Scrubber Playbar */} down to the closing )}
# Note: we need to make sure we don't accidentally delete the rest of the file.
# Since we know it starts with {/* Video Scrubber Playbar */} and ends with `)}` that corresponds to `{!isLoading && slides.length > 0 && (`
# I'll just use a non-greedy regex to delete it.

scrubber_regex = r'\{\/\* Video Scrubber Playbar \*\/}.*?<\/div>\s*<\/div>\s*<\/div>\s*\)\}'
content = re.sub(scrubber_regex, '', content, flags=re.DOTALL)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Cleaned')
