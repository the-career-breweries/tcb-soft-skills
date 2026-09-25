import re

path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\curriculum-computing.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

recap_obj = "  { week: 'Mid-Sem', semester: 1, theme: 'Mid-Semester Recap: CO1 & CO2', focus: 'Hardware, OS, Word & PowerPoint', task: 'Interactive Recap & Quiz', rubric: 'Revision' },"

# Insert before week 7
content = content.replace("  { week: 7, semester: 1, theme: 'MS Excel: Formulas'",
                          recap_obj + "\n  { week: 7, semester: 1, theme: 'MS Excel: Formulas'")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
