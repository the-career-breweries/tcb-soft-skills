import sys

def inject_images(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

w3_reps = {
    '# The Mechanics of Voice Confidence\n\n': '# The Mechanics of Voice Confidence\n\n![Mechanics](/images/w3_mechanics.svg)\n\n',
    '# Activity: Pair Talk & Short Response\n\n': '# Activity: Pair Talk & Short Response\n\n![Activity](/images/w3_activity.svg)\n\n',
    '# Evaluation Rubric\n\n': '# Evaluation Rubric\n\n![Rubric](/images/w3_rubric.svg)\n\n'
}

w4_reps = {
    '## Professional Presence & Soft Skills Basics\n\n': '## Professional Presence & Soft Skills Basics\n\n![Professional Presence](/images/w4_presence.svg)\n\n',
    '# What is Professional Presence?\n\n': '# What is Professional Presence?\n\n![What is Presence](/images/w4_what.svg)\n\n',
    '# The 3 Pillars of Presence\n\n': '# The 3 Pillars of Presence\n\n![Pillars](/images/w4_pillars.svg)\n\n',
    '# Activity: The Soft-Skills Peer Review\n\n': '# Activity: The Soft-Skills Peer Review\n\n![Activity](/images/w4_peer.svg)\n\n',
    '# Evaluation Rubric\n\n': '# Evaluation Rubric\n\n![Rubric](/images/w4_rubric.svg)\n\n'
}

inject_images('src/content/lessons/ug/bcom/sem1/week3.md', w3_reps)
inject_images('src/content/lessons/ug/bcom/sem1/week4.md', w4_reps)

print('Markdown files updated!')
