import os
import glob
import re

base_content_dir = r'C:\Projects\tcb-soft-skills\curriculum-app\src\content'
base_img_slides = r'C:\Projects\tcb-soft-skills\curriculum-app\public\images\slides'
base_img_english = r'C:\Projects\tcb-soft-skills\curriculum-app\public\images\english'

def get_image(dir_path, prefix):
    pattern = os.path.join(dir_path, f'{prefix}_*.jpg')
    matches = glob.glob(pattern)
    if matches:
        return os.path.basename(matches[0])
    return None

def inject_image(filepath, img_rel_path, week_num):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    slides = content.split('---')
    if not slides:
        return
        
    first_slide = slides[0]
    
    # Check if image is already injected
    if '![Week' in first_slide or img_rel_path in first_slide:
        # We might have injected the old placeholder. Let's replace it!
        # Regex to match ![...](/images/...)
        first_slide = re.sub(r'!\[.*?\]\(/images/.*?\)\n*', '', first_slide)
        
    lines = first_slide.strip().split('\n')
    new_lines = []
    inserted = False
    
    for i, line in enumerate(lines):
        new_lines.append(line)
        if (line.startswith('## ') or line.startswith('*') or line.startswith('### ')) and not inserted:
            new_lines.append('')
            new_lines.append(f'![Week {week_num} Illustration]({img_rel_path})')
            new_lines.append('')
            inserted = True
            
    if not inserted and len(lines) > 0:
        new_lines.insert(1, '')
        new_lines.insert(2, f'![Week {week_num} Illustration]({img_rel_path})')
        new_lines.insert(3, '')
        
    slides[0] = '\n'.join(new_lines) + '\n\n'
    final_content = '\n\n---\n\n'.join(slide.strip() for slide in slides)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(final_content)
        
    print(f"Injected {img_rel_path} into {filepath}")

# For Soft Skills
for stream in ['bba-aviation', 'bsc-aviation']:
    files = glob.glob(os.path.join(base_content_dir, 'lessons', 'ug', stream, 'sem1', '*.md'))
    for f in files:
        week_match = re.search(r'week(\d+)\.md', f)
        if week_match:
            week_num = int(week_match.group(1))
            img_name = get_image(base_img_slides, f'aviation_soft_skills_w{week_num}')
            if img_name:
                inject_image(f, f'/images/slides/{img_name}', week_num)
            else:
                print(f"No image found for soft skills week {week_num}")

# For English
for stream in ['bba-aviation', 'bsc-aviation']:
    files = glob.glob(os.path.join(base_content_dir, 'english-lessons', 'ug', stream, 'sem1', '*.md'))
    for f in files:
        week_match = re.search(r'week(\d+)\.md', f)
        if week_match:
            week_num = int(week_match.group(1))
            img_name = get_image(base_img_english, f'aviation_english_w{week_num}')
            if img_name:
                inject_image(f, f'/images/english/{img_name}', week_num)
            else:
                print(f"No image found for english week {week_num}")

print("Done!")
