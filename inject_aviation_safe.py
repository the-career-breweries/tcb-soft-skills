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

def inject_image_safe(filepath, img_rel_path, week_num):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if img_rel_path in content or f'![Week {week_num}' in content:
        print(f"Already injected in {filepath}")
        return
        
    # Find the first slide separator
    match = re.search(r'\n---\n', content)
    if not match:
        print(f"No slide separator found in {filepath}")
        return
        
    insert_pos = match.start()
    
    img_markdown = f'\n\n![Week {week_num} Illustration]({img_rel_path})\n'
    new_content = content[:insert_pos] + img_markdown + content[insert_pos:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
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
                inject_image_safe(f, f'/images/slides/{img_name}', week_num)
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
                inject_image_safe(f, f'/images/english/{img_name}', week_num)
            else:
                print(f"No image found for english week {week_num}")

print("Safe injection done!")
