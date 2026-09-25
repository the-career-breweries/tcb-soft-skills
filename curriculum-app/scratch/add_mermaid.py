import re

files = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\computing-skills\ug\bba-aviation\sem1\weekMid-Sem.md',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\computing-skills\ug\bsc-aviation\sem1\weekMid-Sem.md'
]

mermaid_diagram = """
```mermaid
flowchart LR
    A[Input Unit<br/>Keyboard, Mouse] --> B((CPU<br/>CU + ALU))
    B <--> C[(Memory Unit<br/>RAM, HDD)]
    B --> D[Output Unit<br/>Monitor, Printer]
    
    style A fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
    style B fill:#9333ea,stroke:#6b21a8,stroke-width:2px,color:#fff
    style C fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    style D fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
```
"""

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the block diagram bullet points and replace them
    pattern = re.compile(r'- \*\*Block Diagram of a Computer:\*\*(.*?)- \*\*Data Flow:\*\*.*?Output\.', re.DOTALL)
    
    replacement = "- **Block Diagram of a Computer:**\n\n" + mermaid_diagram + "\n\n- **Data Flow:** Input ➡️ CPU (Processes with Memory) ➡️ Output."
    
    content = pattern.sub(replacement, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
