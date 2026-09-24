import os
import glob
import re

base_content_dir = r'C:\Projects\tcb-soft-skills\curriculum-app\src\content'

def inject_image(filepath, week_num, image_path):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    slides = content.split('---')
    if not slides:
        return
        
    first_slide = slides[0]
    
    if image_path in first_slide:
        return
        
    lines = first_slide.strip().split('\n')
    new_lines = []
    inserted = False
    
    for i, line in enumerate(lines):
        new_lines.append(line)
        if line.startswith('## ') or line.startswith('*') and not inserted:
            new_lines.append('')
            new_lines.append(f'![Week {week_num} Illustration]({image_path})')
            new_lines.append('')
            inserted = True
            
    if not inserted and len(lines) > 0:
        new_lines.insert(1, '')
        new_lines.insert(2, f'![Week {week_num} Illustration]({image_path})')
        new_lines.insert(3, '')
        
    slides[0] = '\n'.join(new_lines) + '\n\n'
    final_content = '\n\n---\n\n'.join(slide.strip() for slide in slides)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(final_content)
        
    print(f"Injected into {filepath}")

# For Soft Skills
for stream in ['bba-aviation', 'bsc-aviation']:
    files = glob.glob(os.path.join(base_content_dir, 'lessons', 'ug', stream, 'sem1', '*.md'))
    for f in files:
        week_match = re.search(r'week(\d+)\.md', f)
        if week_match:
            week_num = int(week_match.group(1))
            inject_image(f, week_num, f'/images/slides/ug_week{week_num}.jpg')

# For English
for stream in ['bba-aviation', 'bsc-aviation']:
    files = glob.glob(os.path.join(base_content_dir, 'english-lessons', 'ug', stream, 'sem1', '*.md'))
    for f in files:
        week_match = re.search(r'week(\d+)\.md', f)
        if week_match:
            week_num = int(week_match.group(1))
            inject_image(f, week_num, f'/images/english/ug_week{week_num}.jpg')

print("Done!")
