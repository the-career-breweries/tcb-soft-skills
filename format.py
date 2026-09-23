import os
import re
import glob

files_downloads = {
    4: 'Lecture_04_MS_Word_Document_Creation_Demo.docx',
    5: 'Lecture_05_MS_Word_Formatting_Demo.docx',
    6: 'Lecture_06_MS_Word_Tables_Reports_Demo.docx',
    7: 'Lecture_07_MS_Excel_Formulas_Demo.xlsx',
    8: 'Lecture_08_MS_Excel_Functions_Demo.xlsx',
    9: 'Lecture_09_MS_Excel_Charts_Demo.xlsx',
    10: 'Lecture_10_MS_Excel_Basic_Data_Analysis_Demo.xlsx',
    14: 'Lecture_14_Cyber_Safety_Pledge_Template.docx'
}

def clean_text(text):
    text = text.replace('?"', '—')
    text = text.replace('?o', '"')
    text = text.replace('??', '"')
    return text

def format_slide(slide_text):
    lines = slide_text.strip().split('\n')
    formatted = []
    
    header = lines[0].strip() if lines else ""
    
    if header.startswith('* LECTURE ') and 'LAB' in header:
        formatted.append('# \U0001F6E0\uFE0F ' + header.replace('* LECTURE', 'Lecture').strip())
        lines = lines[1:]
    elif header.startswith('* KEY CONCEPT'):
        formatted.append('# \U0001F9E0 Key Concept')
        lines = lines[1:]
    elif header.startswith('* HANDS-ON PRACTICE'):
        formatted.append('# \U0001F4BB Hands-on Practice')
        lines = lines[1:]
    elif header.startswith('* CLASS ACTIVITY'):
        formatted.append('# \U0001F91D Class Activity')
        lines = lines[1:]
    elif header.startswith('* YOUR TASK'):
        formatted.append('# \U0001F4DD Your Task')
        lines = lines[1:]
    elif header.startswith('* LEARN MORE'):
        formatted.append('# \U0001F4DA Learn More')
        lines = lines[1:]
    elif header.startswith('* WRAP UP'):
        formatted.append('# \U0001F3C1 Wrap Up')
        lines = lines[1:]
    elif header.startswith('* Lecture'):
        formatted.append('# \U0001F4BB ' + header.replace('* ', ''))
        lines = lines[1:]
    
    for line in lines:
        line = line.strip()
        if not line:
            formatted.append('')
            continue
            
        if line == '* HARDWARE' or line == '* SOFTWARE' or line == '* INPUT DEVICES' or line == '* OUTPUT DEVICES':
            formatted.append(f'\n### \U0001F539 {line.replace("* ", "").title()}')
            continue
            
        if line.startswith('* ') and line.replace('* ', '').isupper() and len(line) > 5:
            formatted.append(f'\n### \U0001F539 {line.replace("* ", "").title()}')
            continue
            
        if line.startswith('* '):
            content = line[2:].strip()
            
            if not formatted and not header.startswith('* Lecture'):
                formatted.append(f'## {content}\n')
                continue
                
            if header.startswith('* Lecture') and len(formatted) < 4:
                if 'Introduction to' in content or '|' in content or 'Syllabus' in content:
                    if '|' in content:
                        formatted.append(f'*{content}*')
                    else:
                        formatted.append(f'## {content}')
                    continue
            
            num_match = re.match(r'^(\d+\.)\s+(.*)', content)
            if num_match:
                formatted.append(f'{num_match.group(1)} {num_match.group(2)}')
                continue
                
            dash_split = content.split(' — ', 1)
            if len(dash_split) == 2 and len(dash_split[0]) < 40:
                formatted.append(f'- **{dash_split[0]}** — {dash_split[1]}')
                continue
                
            formatted.append(f'- {content}')
        elif line.startswith('```'):
            formatted.append(line)
        else:
            formatted.append(line)
            
    return '\n'.join(formatted)

def process_file(filepath):
    # Determine week number
    week_match = re.search(r'week(\d+)\.md', filepath)
    week_num = int(week_match.group(1)) if week_match else 0
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    content = clean_text(content)
    slides = content.split('---')
    
    formatted_slides = []
    for slide in slides:
        if slide.strip():
            formatted_slides.append(format_slide(slide))
            
    if week_num in files_downloads:
        dl_slide = f"# \U0001F6E0\uFE0F Lab Activity File\n\nPlease download the starting file below to follow along with today's hands-on lab exercise.\n\n```download\n{files_downloads[week_num]}\n```"
        formatted_slides.append(dl_slide)
                
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
print("Done formatting!")
