import os
import glob
import re

base_img_dir = r'C:\Projects\tcb-soft-skills\curriculum-app\public\images'
base_content_dir = r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\computing-skills\ug'

def get_image_for_week(week_num):
    # Try to find the exact week image
    pattern = os.path.join(base_img_dir, f'computing_w{week_num}_*.jpg')
    matches = glob.glob(pattern)
    if matches:
        return os.path.basename(matches[0])
    
    # Fallback to week 13 for week 14 (since it failed generation)
    if week_num == 14:
        pattern = os.path.join(base_img_dir, f'computing_w13_*.jpg')
        matches = glob.glob(pattern)
        if matches:
            return os.path.basename(matches[0])
            
    return None

def inject_image(filepath, week_num):
    img_name = get_image_for_week(week_num)
    if not img_name:
        print(f"No image found for week {week_num}, skipping {filepath}")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    slides = content.split('---')
    if not slides:
        return
        
    first_slide = slides[0]
    
    # Check if image is already injected to avoid duplicates
    if f'/images/{img_name}' in first_slide:
        print(f"Image already injected in {filepath}")
        return
        
    # We want to insert the image after the first couple of headings
    # Usually it's:
    # # 💻 Lecture 01
    # ## Topic Name
    # - Bullet
    
    lines = first_slide.strip().split('\n')
    new_lines = []
    inserted = False
    
    for i, line in enumerate(lines):
        new_lines.append(line)
        if line.startswith('## ') and not inserted:
            # Insert image right after the subtitle
            new_lines.append('')
            new_lines.append(f'![Week {week_num} Illustration](/images/{img_name})')
            new_lines.append('')
            inserted = True
            
    # Fallback if no ## heading was found
    if not inserted and len(lines) > 0:
        new_lines.insert(1, '')
        new_lines.insert(2, f'![Week {week_num} Illustration](/images/{img_name})')
        new_lines.insert(3, '')
        
    slides[0] = '\n'.join(new_lines) + '\n\n'
    final_content = '\n\n---\n\n'.join(slide.strip() for slide in slides)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(final_content)
        
    print(f"Injected image into {filepath}")

for stream in ['bba-aviation', 'bsc-aviation']:
    files = glob.glob(os.path.join(base_content_dir, stream, 'sem1', '*.md'))
    for f in files:
        if 'orientation' in f:
            continue
        week_match = re.search(r'week(\d+)\.md', f)
        if week_match:
            week_num = int(week_match.group(1))
            inject_image(f, week_num)
            
print("Done injecting images!")
