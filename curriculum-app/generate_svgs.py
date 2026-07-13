import os

svg_template = '''<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="{bg_color}" rx="20"/>
  <text x="50%" y="45%" font-family="'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif" font-size="140" text-anchor="middle" dominant-baseline="middle">{emoji}</text>
  <text x="50%" y="75%" font-family="'Inter', system-ui, sans-serif" font-size="36" font-weight="700" fill="{text_color}" text-anchor="middle">{title}</text>
</svg>'''

images = [
    ('w3_mechanics.svg', '#f0fdfa', '#115e59', '🎚️', 'Volume & Pacing'),
    ('w3_activity.svg', '#fff7ed', '#9a3412', '💬', 'Pair Talk Practice'),
    ('w3_rubric.svg', '#faf5ff', '#6b21a8', '⭐', 'Evaluation Criteria'),
    
    ('w4_presence.svg', '#f0f9ff', '#0369a1', '👔', 'Professional Presence'),
    ('w4_what.svg', '#fdf4ff', '#86198f', '👀', 'Look, Act, Communicate'),
    ('w4_pillars.svg', '#ecfdf5', '#047857', '🏛️', 'The 3 Pillars'),
    ('w4_peer.svg', '#fff1f2', '#be123c', '📋', 'Peer Review Audit'),
    ('w4_rubric.svg', '#f8fafc', '#334155', '🎯', 'Application & Awareness')
]

out_dir = 'public/images/'
for filename, bg, txt, emoji, title in images:
    filepath = os.path.join(out_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg_template.format(bg_color=bg, text_color=txt, emoji=emoji, title=title))

print('SVGs generated successfully!')
