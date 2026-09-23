import os
import glob
import re

def clean_lab_text(text):
    # Remove lines containing specific unwanted phrases
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        lower_line = line.lower()
        if 'extended lab session' in lower_line:
            continue
        if 'lab safety rules' in lower_line:
            # Maybe just cut that part out instead of deleting the line?
            line = re.sub(r'[-—]?\s*Lab safety rules.*?$', '', line, flags=re.IGNORECASE).strip()
            
        if "today's lab plan" in lower_line or "today's class plan" in lower_line or "lab plan" in lower_line:
            continue # just skip this specific line, not the whole slide
        
        # Replace word boundaries
        line = re.sub(r'\bLAB\b', '', line) # e.g. "Lecture 01 LAB" -> "Lecture 01 "
        line = re.sub(r'\blab PC\b', 'laptop', line, flags=re.IGNORECASE)
        line = re.sub(r'\blab files\b', 'files', line, flags=re.IGNORECASE)
        line = re.sub(r'\blab exercise\b', 'exercise', line, flags=re.IGNORECASE)
        line = re.sub(r'\blab session\b', 'session', line, flags=re.IGNORECASE)
        line = re.sub(r'\blab folder\b', 'folder', line, flags=re.IGNORECASE)
        line = re.sub(r'\bthe lab\b', 'class', line, flags=re.IGNORECASE)
        line = re.sub(r'\blab period\b', 'session', line, flags=re.IGNORECASE)
        line = re.sub(r'\blab\b', 'class', line, flags=re.IGNORECASE)
        
        cleaned_lines.append(line)
        
    return '\n'.join(cleaned_lines)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    slides = content.split('---')
    
    formatted_slides = []
    for slide in slides:
        if not slide.strip():
            continue
            
        cleaned_slide = clean_lab_text(slide)
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
print("Done lab cleaning!")
