import os
import re

def inject_fetch(filepath, subject_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where localStorage.setItem('tcb-progress'...) happens
    # We will just inject the fetch call right below it.
    
    injection = f'''
        // --- ERP CLOUD BRIDGE SYNC ---
        try {{
          fetch('/api/erp-progress', {{
            method: 'POST',
            headers: {{ 'Content-Type': 'application/json' }},
            body: JSON.stringify({{
              subject: "{subject_name}",
              section: typeof targetSection !== 'undefined' ? targetSection : (typeof activeSection !== 'undefined' ? activeSection : 'General'),
              progress: data,
              key: "latest_sync",
              details: "Auto-synced from presentation mode"
            }})
          }}).catch(e => console.log('ERP Sync failed', e));
        }} catch(e) {{}}
        // -----------------------------
'''
    
    # Simple replacement: replace localStorage.setItem with itself + injection
    target = "localStorage.setItem('tcb-progress', JSON.stringify(data));"
    new_content = content.replace(target, target + injection)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
inject_fetch('src/app/communicative-english/page.tsx', 'Communicative English')
inject_fetch('src/app/computing-skills/page.tsx', 'Computing Skills')
inject_fetch('src/components/SoftSkillsApp.tsx', 'Soft Skills')
inject_fetch('src/components/SlideViewer.tsx', 'Slide Viewer Activity')

print("Injection complete.")
