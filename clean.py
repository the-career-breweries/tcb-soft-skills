import os
import glob

def clean_slide_lines(slide):
    lines = slide.split('\n')
    new_lines = []
    for line in lines:
        lower_line = line.lower()
        if 'practical lab session' in lower_line:
            continue
        if '(110 min)' in lower_line or '110 minutes' in lower_line:
            continue
        if 'common for section' in lower_line:
            continue
        if 'alliance university' in lower_line:
            continue
        if 'bsc aviation' in lower_line or 'bba aviation' in lower_line:
            continue
        new_lines.append(line)
    return '\n'.join(new_lines)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    slides = content.split('---')
    
    formatted_slides = []
    for slide in slides:
        if not slide.strip():
            continue
            
        # Skip the entire Session Plan slide
        if 'Session Plan' in slide or 'Session plan' in slide:
            continue
            
        cleaned_slide = clean_slide_lines(slide)
        formatted_slides.append(cleaned_slide.strip())
                
    final_content = '\n\n---\n\n'.join(formatted_slides)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    print(f"Processed {filepath}")

base_dir = r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\computing-skills\ug'
for stream in ['bba-aviation', 'bsc-aviation']:
    files = glob.glob(os.path.join(base_dir, stream, 'sem1', '*.md'))
    for f in files:
        if 'orientation' not in f:
            process_file(f)
print("Done cleaning!")
